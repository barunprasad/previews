import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Previews - Create Beautiful App Store Screenshots";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(145deg, #fefefe 0%, #fdf4ee 30%, #fef3e8 60%, #fff9f5 100%)",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Large gradient orbs for aurora effect */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(251, 146, 60, 0.2) 40%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 100,
            left: -200,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, rgba(252, 211, 77, 0.15) 40%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: 200,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(248, 113, 113, 0.25) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: 300,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />

        {/* Left side - Text content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            paddingRight: "40px",
            width: "55%",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(249, 115, 22, 0.1)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: 50,
                padding: "8px 16px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l1.5 4.5H18l-3.75 2.75L15.75 15 12 12.25 8.25 15l1.5-4.75L6 7.5h4.5L12 3z" fill="#f97316"/>
              </svg>
              <span style={{ color: "#c2410c", fontSize: 14, fontWeight: 600 }}>
                Free & Fast
              </span>
            </div>
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#1a1a1a",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Create stunning
          </h1>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              margin: 0,
              marginTop: 4,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            app screenshots
          </h1>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#1a1a1a",
              margin: 0,
              marginTop: 4,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            in minutes
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: 22,
              color: "#6b7280",
              margin: 0,
              marginTop: 24,
              lineHeight: 1.5,
            }}
          >
            Beautiful device mockups for iOS & Android.
            <br />
            No design skills needed.
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
            }}
          >
            {["iPhone 17 Pro", "Galaxy S25", "Pixel 9"].map((device) => (
              <div
                key={device}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderRadius: 50,
                  padding: "8px 16px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316, #fb923c)",
                  }}
                />
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                  {device}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Device mockups */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "45%",
            position: "relative",
          }}
        >
          {/* Glow behind devices */}
          <div
            style={{
              position: "absolute",
              width: 350,
              height: 450,
              background: "radial-gradient(ellipse, rgba(249, 115, 22, 0.25) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          {/* iPhone mockup */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              marginRight: -40,
              zIndex: 2,
              transform: "rotate(-5deg)",
            }}
          >
            {/* Device frame */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 160,
                height: 330,
                background: "linear-gradient(145deg, #1f1f1f 0%, #2d2d2d 50%, #1a1a1a 100%)",
                borderRadius: 28,
                padding: 4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              {/* Screen */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  background: "linear-gradient(145deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
                  borderRadius: 24,
                  padding: 16,
                  paddingTop: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Dynamic Island */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 70,
                    height: 22,
                    background: "#000",
                    borderRadius: 20,
                  }}
                />
                {/* App content mockup */}
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 16, width: "75%", background: "rgba(255,255,255,0.4)", borderRadius: 6 }} />
                  <div style={{ height: 12, width: "50%", background: "rgba(255,255,255,0.25)", borderRadius: 4 }} />
                  <div style={{ height: 80, width: "100%", background: "rgba(255,255,255,0.2)", borderRadius: 12, marginTop: 8 }} />
                  <div style={{ height: 10, width: "60%", background: "rgba(255,255,255,0.25)", borderRadius: 4 }} />
                </div>
              </div>
            </div>
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 20,
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.4)",
              }}
            >
              iPhone 17 Pro
            </div>
          </div>

          {/* Android mockup */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "relative",
              zIndex: 1,
              transform: "rotate(5deg)",
            }}
          >
            {/* Device frame */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 150,
                height: 310,
                background: "linear-gradient(145deg, #374151 0%, #4b5563 50%, #374151 100%)",
                borderRadius: 20,
                padding: 4,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              {/* Screen */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  background: "linear-gradient(145deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
                  borderRadius: 16,
                  padding: 14,
                  paddingTop: 28,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Punch hole camera */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 12,
                    height: 12,
                    background: "#1f2937",
                    borderRadius: "50%",
                  }}
                />
                {/* App content mockup */}
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ height: 14, width: "70%", background: "rgba(255,255,255,0.4)", borderRadius: 5 }} />
                  <div style={{ height: 10, width: "45%", background: "rgba(255,255,255,0.25)", borderRadius: 4 }} />
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <div style={{ height: 60, width: "48%", background: "rgba(255,255,255,0.2)", borderRadius: 8 }} />
                    <div style={{ height: 60, width: "48%", background: "rgba(255,255,255,0.2)", borderRadius: 8 }} />
                  </div>
                  <div style={{ height: 10, width: "55%", background: "rgba(255,255,255,0.25)", borderRadius: 4 }} />
                </div>
              </div>
            </div>
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 20,
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              }}
            >
              Galaxy S25
            </div>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 60,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>
            previews.bpstack.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
