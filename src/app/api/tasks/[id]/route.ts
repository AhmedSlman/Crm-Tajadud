import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignedTo: true,
        createdBy: true,
        subtasks: true,
        comments: {
          include: {
            author: true,
            replies: {
              include: {
                author: true,
              },
            },
          },
        },
        attachments: true,
        changeLogs: true,
      },
    });
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const oldTask = await prisma.task.findUnique({
      where: { id },
    });
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        completionDate: body.completionDate ? new Date(body.completionDate) : undefined,
      },
    });
    
    // Create change log for status changes
    if (oldTask && body.status && oldTask.status !== body.status) {
      await prisma.changeLog.create({
        data: {
          field: 'status',
          oldValue: oldTask.status,
          newValue: body.status,
          changedBy: body.changedById || 'system',
          taskId: id,
        },
      });
      
      // Notify assigned user of status change
      if (task.assignedToId) {
        await prisma.notification.create({
          data: {
            type: 'status-update',
            title: 'Task Status Updated',
            message: `"${task.title}" status changed to ${body.status}`,
            link: `/tasks/${task.id}`,
            userId: task.assignedToId,
          },
        });
      }
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.task.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

