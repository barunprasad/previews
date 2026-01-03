import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VALID_SIZES = [192, 512];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params;
  const size = parseInt(sizeParam, 10);

  if (!VALID_SIZES.includes(size)) {
    return new Response("Invalid size", { status: 400 });
  }

  // Scale factors based on size
  const scale = size / 180;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
          borderRadius: 32 * scale,
        }}
      >
        {/* Device frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 90 * scale,
            height: 130 * scale,
            backgroundColor: "#1a1a1a",
            borderRadius: 12 * scale,
            padding: `${8 * scale}px ${6 * scale}px`,
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              width: 36 * scale,
              height: 10 * scale,
              backgroundColor: "#000",
              borderRadius: 5 * scale,
              marginBottom: 8 * scale,
            }}
          />
          {/* Screen */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8 * scale,
              width: "100%",
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 6 * scale,
              padding: 10 * scale,
            }}
          >
            {/* Content lines */}
            <div
              style={{
                width: "70%",
                height: 8 * scale,
                backgroundColor: "#f97316",
                borderRadius: 4 * scale,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                width: "90%",
                height: 8 * scale,
                backgroundColor: "#f97316",
                borderRadius: 4 * scale,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "50%",
                height: 8 * scale,
                backgroundColor: "#f97316",
                borderRadius: 4 * scale,
                opacity: 0.3,
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
