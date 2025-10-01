import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get all campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    
    const where: { projectId?: string; status?: string } = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    
    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        responsiblePerson: {
          select: {
            id: true,
            name: true,
          },
        },
        kpis: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        type: body.type,
        objective: body.objective,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        budget: body.budget,
        status: body.status,
        progress: body.progress || 0,
        projectId: body.projectId,
        responsiblePersonId: body.responsiblePersonId,
        createdById: body.createdById,
      },
      include: {
        project: true,
        responsiblePerson: true,
      },
    });
    
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

