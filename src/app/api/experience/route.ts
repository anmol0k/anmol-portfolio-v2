import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/schemas/experienceSchema";

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

    const experiences = await Experience.find(filter)
      .sort({
        order: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("GET experience error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch experience",
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

    const validation = experienceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid experience data",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const experience = await Experience.create(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Experience created successfully",
        experience,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST experience error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create experience",
      },
      {
        status: 500,
      }
    );
  }
}