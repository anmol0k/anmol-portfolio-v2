import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const payload = {
      name:
        typeof body.name === "string"
          ? body.name.trim()
          : "",

      email:
        typeof body.email === "string"
          ? body.email.trim().toLowerCase()
          : "",

      subject:
        typeof body.subject === "string"
          ? body.subject.trim()
          : "",

      message:
        typeof body.message === "string"
          ? body.message.trim()
          : "",
    };

    const validation =
      messageSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]
              ?.message ||
            "Invalid message data",
        },
        {
          status: 400,
        }
      );
    }

    const newMessage =
      await Message.create({
        ...validation.data,
        isRead: false,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Message received successfully",
        data: {
          _id: newMessage._id,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST message error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to save your message",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
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

    const messages =
      await Message.find({})
        .sort({
          isRead: 1,
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "GET messages error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load messages",
      },
      {
        status: 500,
      }
    );
  }
}