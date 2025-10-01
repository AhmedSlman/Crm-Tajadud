import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    
    const where: { projectId?: string; status?: string } = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    
    const content = await prisma.content.findMany({
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
          },
        },
        attachments: true,
        comments: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const content = await prisma.content.create({
      data: {
        title: body.title,
        contentType: body.contentType,
        status: body.status,
        priority: body.priority,
        startDate: new Date(body.startDate),
        dueDate: new Date(body.dueDate),
        publishDate: body.publishDate ? new Date(body.publishDate) : null,
        progress: body.progress || 0,
        projectId: body.projectId || null,
        campaignId: body.campaignId || null,
        assignedToId: body.assignedToId,
        createdById: body.createdById,
      },
      include: {
        assignedTo: true,
        project: true,
      },
    });
    
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

