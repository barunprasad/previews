import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 32,
        }}
      >
        {/* Device frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            width: 90,
            height: 130,
            backgroundColor: "#1a1a1a",
            borderRadius: 12,
            padding: "8px 6px",
          }}
        >
          {/* Dynamic island */}
          <div
            style={{
              width: 36,
              height: 10,
              backgroundColor: "#000",
              borderRadius: 5,
              marginBottom: 8,
            }}
          />
          {/* Screen */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 6,
              padding: 10,
            }}
          >
            {/* Content lines */}
            <div
              style={{
                width: "70%",
                height: 8,
                backgroundColor: "#f97316",
                borderRadius: 4,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                width: "90%",
                height: 8,
                backgroundColor: "#f97316",
                borderRadius: 4,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: "50%",
                height: 8,
                backgroundColor: "#f97316",
                borderRadius: 4,
                opacity: 0.3,
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
