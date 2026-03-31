import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, #ecfccb 0%, #f8fafc 38%, #dcfce7 100%)",
          padding: "56px",
          color: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                height: "64px",
                width: "64px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #22c55e, #10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "30px",
                fontWeight: 700,
              }}
            >
              F
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontSize: "18px", color: "#16a34a", fontWeight: 700 }}>Fresh Harvest</div>
              <div style={{ fontSize: "18px", color: "#64748b" }}>Fruit Store CMS</div>
            </div>
          </div>
          <div
            style={{
              borderRadius: "999px",
              padding: "10px 18px",
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(148, 163, 184, 0.24)",
              fontSize: "18px",
              color: "#334155",
            }}
          >
            Admin Dashboard
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "760px",
          }}
        >
          <div style={{ fontSize: "68px", fontWeight: 800, lineHeight: 1.05 }}>
            Manage your fruit store in one clean dashboard.
          </div>
          <div style={{ fontSize: "28px", lineHeight: 1.35, color: "#475569" }}>
            Inventory, sales, orders, purchases, suppliers, reports, and settings connected in a single CMS.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
          }}
        >
          {[
            ["Inventory", "#dcfce7"],
            ["Orders", "#dbeafe"],
            ["Reports", "#fef3c7"],
            ["Settings", "#f3e8ff"],
          ].map(([label, background]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "22px",
                padding: "16px 24px",
                background,
                color: "#0f172a",
                fontSize: "24px",
                fontWeight: 700,
                border: "1px solid rgba(148, 163, 184, 0.16)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
