import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectSchema } from "@/schemas/projectSchema";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const adminMode =
            searchParams.get("admin") === "true";

        if (adminMode) {
            const session = await getSession();

            if (!session || session.role !== "admin") {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Unauthorized",
                    },
                    {
                        status: 401,
                    }
                );
            }
        }

        const filter = adminMode
            ? {}
            : { isActive: true };

        const projects = await Project.find(filter)
            .sort({
                order: 1,
                createdAt: -1,
            })
            .lean();

        return NextResponse.json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("GET projects error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch projects",
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }
        await connectDB();

        const body = await request.json();

        const validation = projectSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid project data",
                    errors: validation.error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const existingProject = await Project.findOne({
            slug: validation.data.slug,
        });

        if (existingProject) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A project with this slug already exists",
                },
                {
                    status: 409,
                }
            );
        }

        const project = await Project.create(validation.data);

        return NextResponse.json(
            {
                success: true,
                message: "Project created successfully",
                project,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST project error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create project",
            },
            {
                status: 500,
            }
        );
    }
}