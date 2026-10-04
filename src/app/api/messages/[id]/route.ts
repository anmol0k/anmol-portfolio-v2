import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession();

    if (
      !session ||
      session.role !== "admin"
    ) {
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

    const { id } = await context.params;

    const body = await request.json();

    if (
      typeof body.isRead !== "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "isRead must be a boolean",
        },
        {
          status: 400,
        }
      );
    }

    const message =
      await Message.findByIdAndUpdate(
        id,
        {
          isRead: body.isRead,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error(
      "PATCH message error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession();

    if (
      !session ||
      session.role !== "admin"
    ) {
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

    const { id } = await context.params;

    const message =
      await Message.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Message deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE message error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete message",
      },
      {
        status: 500,
      }
    );
  }
}