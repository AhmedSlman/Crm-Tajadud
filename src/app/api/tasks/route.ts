import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all tasks with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignedToId = searchParams.get('assignedToId');
    
    const where: { projectId?: string; status?: string; priority?: string; assignedToId?: string } = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;
    
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        subtasks: true,
        comments: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        priority: body.priority,
        startDate: new Date(body.startDate),
        dueDate: new Date(body.dueDate),
        progress: body.progress || 0,
        projectId: body.projectId || null,
        assignedToId: body.assignedToId,
        createdById: body.createdById,
      },
      include: {
        assignedTo: true,
        project: true,
      },
    });
    
    // Create notification for assigned user
    if (body.assignedToId !== body.createdById) {
      await prisma.notification.create({
        data: {
          type: 'assignment',
          title: 'New Task Assigned',
          message: `You have been assigned to "${body.title}"`,
          link: `/tasks/${task.id}`,
          userId: body.assignedToId,
        },
      });
    }
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

