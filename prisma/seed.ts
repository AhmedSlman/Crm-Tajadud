import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agency.com' },
    update: {},
    create: {
      email: 'admin@agency.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  });

  const projectManager = await prisma.user.upsert({
    where: { email: 'manager@agency.com' },
    update: {},
    create: {
      email: 'manager@agency.com',
      name: 'Sarah Smith',
      password: hashedPassword,
      role: 'project-manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  });

  const teamMember1 = await prisma.user.upsert({
    where: { email: 'designer@agency.com' },
    update: {},
    create: {
      email: 'designer@agency.com',
      name: 'Mike Johnson',
      password: hashedPassword,
      role: 'team-member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
  });

  const teamMember2 = await prisma.user.upsert({
    where: { email: 'writer@agency.com' },
    update: {},
    create: {
      email: 'writer@agency.com',
      name: 'Emily Davis',
      password: hashedPassword,
      role: 'team-member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
  });

  console.log('✅ Users created');

  // Create Clients (delete existing first to avoid duplicates)
  await prisma.client.deleteMany({});
  
  const client1 = await prisma.client.create({
    data: {
      name: 'TechStart Inc.',
      contactPerson: 'David Wilson',
      phone: '+1 234 567 8900',
      email: 'contact@techstart.com',
      company: 'TechStart Inc.',
      notes: 'Looking for comprehensive digital marketing solutions.',
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'GreenLife Solutions',
      contactPerson: 'Lisa Green',
      phone: '+1 234 567 8901',
      email: 'contact@greenlife.com',
      company: 'GreenLife Solutions',
      notes: 'Eco-friendly products, focus on sustainability messaging.',
    },
  });

  console.log('✅ Clients created');

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'TechStart Q1 Campaign',
      description: 'Comprehensive digital marketing campaign for Q1 product launch.',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-03-31'),
      status: 'in-progress',
      progress: 65,
      clientId: client1.id,
      projectManagerId: projectManager.id,
      createdById: admin.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'GreenLife Social Media Strategy',
      description: 'Monthly social media content and engagement strategy.',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-08-15'),
      status: 'in-progress',
      progress: 55,
      clientId: client2.id,
      projectManagerId: projectManager.id,
      createdById: admin.id,
    },
  });

  console.log('✅ Projects created');

  // Create Tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Create Facebook Ad Creatives',
      description: 'Design 5 different ad creatives for the Q1 campaign.',
      type: 'graphic-design',
      status: 'in-progress',
      priority: 'high',
      startDate: new Date('2025-01-25'),
      dueDate: new Date('2025-02-05'),
      progress: 60,
      projectId: project1.id,
      assignedToId: teamMember1.id,
      createdById: projectManager.id,
    },
  });

  // Add subtasks
  await prisma.subtask.createMany({
    data: [
      { title: 'Product showcase ad', completed: true, taskId: task1.id },
      { title: 'Testimonial ad', completed: true, taskId: task1.id },
      { title: 'Feature highlight ad', completed: false, taskId: task1.id },
    ],
  });

  await prisma.task.create({
    data: {
      title: 'Write Blog Post - Product Features',
      description: 'Write a comprehensive blog post about new product features.',
      type: 'content-writing',
      status: 'review',
      priority: 'medium',
      startDate: new Date('2025-01-20'),
      dueDate: new Date('2025-02-01'),
      completionDate: new Date('2025-01-30'),
      progress: 90,
      projectId: project1.id,
      assignedToId: teamMember2.id,
      createdById: projectManager.id,
    },
  });

  console.log('✅ Tasks created');

  // Create Campaigns
  await prisma.campaign.create({
    data: {
      name: 'TechStart Facebook Launch Campaign',
      type: 'facebook-ads',
      objective: 'sales',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-03-31'),
      budget: 15000,
      status: 'running',
      progress: 55,
      projectId: project1.id,
      responsiblePersonId: teamMember1.id,
      createdById: projectManager.id,
      kpis: {
        create: [
          { name: 'CTR', value: '3.2%' },
          { name: 'CPC', value: '$0.85' },
          { name: 'Conversions', value: '234' },
        ],
      },
    },
  });

  console.log('✅ Campaigns created');

  // Create Content
  await prisma.content.create({
    data: {
      title: 'Product Launch Announcement Post',
      contentType: 'post',
      status: 'published',
      priority: 'high',
      startDate: new Date('2025-01-25'),
      dueDate: new Date('2025-02-01'),
      publishDate: new Date('2025-02-01'),
      progress: 100,
      projectId: project1.id,
      assignedToId: teamMember2.id,
      createdById: projectManager.id,
    },
  });

  console.log('✅ Content created');

  // Create Notifications
  await prisma.notification.create({
    data: {
      type: 'deadline',
      title: 'Task Due Soon',
      message: 'Create Facebook Ad Creatives is due in 2 days',
      link: '/tasks',
      userId: teamMember1.id,
    },
  });

  console.log('✅ Notifications created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

