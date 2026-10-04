import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { testimonialSchema } from "@/schemas/testimonialSchema";

export async function GET(
  request: NextRequest
) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const adminMode =
      searchParams.get(
        "admin"
      ) === "true";

    if (adminMode) {
      const session =
        await getSession();

      if (
        !session ||
        session.role !== "admin"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unauthorized",
          },
          {
            status: 401,
          }
        );
      }
    }

    const filter = adminMode
      ? {}
      : {
          isActive: true,
        };

    const testimonials =
      await Testimonial.find(
        filter
      )
        .sort({
          order: 1,
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error(
      "GET testimonials error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch testimonials",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const session =
      await getSession();

    if (
      !session ||
      session.role !== "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const body =
      await request.json();

    const validation =
      testimonialSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid testimonial data",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const testimonial =
      await Testimonial.create(
        validation.data
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Testimonial created successfully",
        testimonial,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST testimonial error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create testimonial",
      },
      {
        status: 500,
      }
    );
  }
}