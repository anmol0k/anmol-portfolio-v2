import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";

import {
  createSession,
} from "@/lib/auth";

import {
  connectDB,
} from "@/lib/mongodb";

import LoginRateLimit from "@/models/LoginRateLimit";
import User from "@/models/User";

import {
  loginSchema,
} from "@/schemas/loginSchema";

const LOGIN_WINDOW =
  15 * 60 * 1000;

const MAX_LOGIN_ATTEMPTS = 5;

function getClientIp(
  request: NextRequest
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    return (
      forwardedFor
        .split(",")[0]
        ?.trim() || "unknown"
    );
  }

  return (
    request.headers.get(
      "x-real-ip"
    ) || "unknown"
  );
}

function createLoginKey(
  ip: string
) {
  const secret =
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not defined"
    );
  }

  return crypto
    .createHmac(
      "sha256",
      secret
    )
    .update(
      `admin-login:${ip}`
    )
    .digest("hex");
}

async function getLoginLimit(
  key: string
) {
  const record =
    await LoginRateLimit.findOne({
      key,
    });

  if (!record) {
    return {
      blocked: false,
      record: null,
    };
  }

  const windowExpired =
    Date.now() -
      record.windowStart.getTime() >=
    LOGIN_WINDOW;

  if (windowExpired) {
    await LoginRateLimit.deleteOne({
      key,
    });

    return {
      blocked: false,
      record: null,
    };
  }

  return {
    blocked:
      record.count >=
      MAX_LOGIN_ATTEMPTS,

    record,
  };
}

async function recordFailedAttempt(
  key: string
) {
  const now = new Date();

  const existing =
    await LoginRateLimit.findOne({
      key,
    });

  if (!existing) {
    await LoginRateLimit.create({
      key,
      count: 1,
      windowStart: now,
    });

    return;
  }

  const windowExpired =
    Date.now() -
      existing.windowStart.getTime() >=
    LOGIN_WINDOW;

  if (windowExpired) {
    existing.count = 1;
    existing.windowStart = now;

    await existing.save();

    return;
  }

  existing.count += 1;

  await existing.save();
}

async function clearLoginAttempts(
  key: string
) {
  await LoginRateLimit.deleteOne({
    key,
  });
}

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const ip =
      getClientIp(request);

    const loginKey =
      createLoginKey(ip);

    const loginLimit =
      await getLoginLimit(
        loginKey
      );

    if (loginLimit.blocked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many login attempts. Please try again later.",
        },
        {
          status: 429,
        }
      );
    }

    const body =
      await request.json();

    const validation =
      loginSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid login data",
          errors:
            validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const email =
      validation.data.email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email,
        role: "admin",
      });

    if (!user) {
      await recordFailedAttempt(
        loginKey
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        validation.data.password,
        user.password
      );

    if (!passwordMatches) {
      await recordFailedAttempt(
        loginKey
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Successful login:
     * remove previous failed
     * attempts for this IP.
     */
    await clearLoginAttempts(
      loginKey
    );

    await createSession({
      userId:
        user._id.toString(),

      email:
        user.email,

      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message:
        "Login successful",

      user: {
        id:
          user._id.toString(),

        email:
          user.email,

        role:
          user.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}