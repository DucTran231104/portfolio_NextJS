import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema validation cho contact form
const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required').max(5000),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate dữ liệu
        const validatedData = contactSchema.parse(body);

        // Lưu vào database
        const contact = await prisma.contact.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                message: validatedData.message,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Contact message saved successfully',
                id: contact.id,
            },
            { status: 201 }
        );
    } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: error.issues,
                },
                { status: 400 }
            );
        }

        // Handle other errors
        console.error('Error saving contact:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to save contact message',
            },
            { status: 500 }
        );
    }
}

// Optional: GET endpoint để lấy danh sách contacts (có thể thêm authentication sau)
export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 100, // Giới hạn 100 contacts mới nhất
        });

        return NextResponse.json(
            {
                success: true,
                data: contacts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch contacts',
            },
            { status: 500 }
        );
    }
}

