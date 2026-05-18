"use client";

import { Icon } from "@iconify/react";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface ShaderInstance {
  destroy: () => void;
  setSpeed?: (speed: number) => void;
}

type ButtonSize = "sm" | "md" | "lg";

interface ButtonDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  fontSize: number;
  iconSize: number;
}

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon" | "both";
  size?: ButtonSize;
  icon?: string | React.ElementType | React.ReactNode;
  iconPosition?: "left" | "right";
}

export function LiquidMetalButton({
  label = "Get Started",
  onClick,
  viewMode,
  size = "md",
  icon: IconProp,
  iconPosition = "left",
}: LiquidMetalButtonProps) {

  const activeMode = useMemo(() => {
    if (viewMode) return viewMode;
    return IconProp ? "both" : "text";
  }, [viewMode, IconProp]);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderInstance | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const dimensions = useMemo((): ButtonDimensions => {
    const config = {
      sm: { height: 32, minWidth: 32, fontSize: 12, iconSize: 14, px: 12 },
      md: { height: 46, minWidth: 46, fontSize: 14, iconSize: 18, px: 20 },
      lg: { height: 60, minWidth: 60, fontSize: 16, iconSize: 22, px: 28 },
    };

    const s = config[size];
    let width = s.minWidth;

    if (activeMode !== "icon") {
      const textWidth = label.length * (s.fontSize * 0.6);
      const iconSpace = (activeMode === "both" || (IconProp && !viewMode)) ? s.iconSize + 8 : 0;
      width = textWidth + iconSpace + s.px * 2;
    }

    return {
      width,
      height: s.height,
      innerWidth: width - 4,
      innerHeight: s.height - 4,
      fontSize: s.fontSize,
      iconSize: s.iconSize,
    };
  }, [activeMode, size, label, IconProp, viewMode]);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important; height: 100% !important;
          display: block !important; position: absolute !important;
          top: 0 !important; left: 0 !important; border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        const { liquidMetalFragmentShader, ShaderMount } = await import("@paper-design/shaders");
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) shaderMount.current.destroy();
          shaderMount.current = new (ShaderMount as any)(
            shaderRef.current,
            liquidMetalFragmentShader,
            {
              u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3, u_shiftBlue: 0.3,
              u_distortion: 0, u_contour: 0, u_angle: 45, u_scale: 8, u_shape: 1,
              u_offsetX: 0.1, u_offsetY: -0.1,
            },
            undefined, 0.6
          ) as ShaderInstance;
        }
      } catch (error) {
        console.error("Failed to load shader:", error);
      }
    };
    loadShader();
    return () => shaderMount.current?.destroy?.();
  }, []);

  const handleMouseEnter = () => { setIsHovered(true); shaderMount.current?.setSpeed?.(1); };
  const handleMouseLeave = () => { setIsHovered(false); setIsPressed(false); shaderMount.current?.setSpeed?.(0.6); };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed?.(2.4);
    setTimeout(() => shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6), 300);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)), 600);
    }
    onClick?.();
  };

  const renderIcon = () => {
    if (!IconProp && viewMode === "text") return null;

    const iconStyle: React.CSSProperties = {
      color: "#f9f9f9",
      filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.5))",
      flexShrink: 0,
      width: dimensions.iconSize,
      height: dimensions.iconSize,
    };

    if (typeof IconProp === "string") {
      return <Icon icon={IconProp} style={iconStyle} />;
    }

    if (typeof IconProp === "function" || (typeof IconProp === "object" && IconProp !== null)) {
      const CustomIcon = IconProp as React.ElementType;
      return <CustomIcon size={dimensions.iconSize} style={iconStyle} />;
    }

    return IconProp ? (
      <div style={iconStyle}>{IconProp}</div>
    ) : (
      <Sparkles size={dimensions.iconSize} style={iconStyle} />
    );
  };

  return (
    <div className="relative inline-block select-none">
      <div style={{ perspective: "1000px" }}>
        <div style={{
          position: "relative",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transformStyle: "preserve-3d",
          transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
        }}>
          <div style={{
            position: "absolute", inset: 0, zIndex: 30,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", pointerEvents: "none", transform: "translateZ(20px)",
            flexDirection: iconPosition === "right" ? "row-reverse" : "row"
          }}>
            {(activeMode === "icon" || activeMode === "both") && renderIcon()}

            {activeMode !== "icon" && (
              <span style={{
                fontSize: `${dimensions.fontSize}px`, color: "#f9f9f9",
                fontWeight: 500, textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap"
              }}>
                {label}
              </span>
            )}
          </div>

          <div style={{
            position: "absolute", inset: 0, zIndex: 20,
            transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0)"}`,
            transition: "transform 0.1s ease"
          }}>
            <div style={{
              width: `${dimensions.innerWidth}px`, height: `${dimensions.innerHeight}px`,
              margin: "2px", borderRadius: "100px",
              background: "linear-gradient(180deg, #202020 0%, #000 100%)",
              boxShadow: isPressed ? "inset 0 2px 4px rgba(0,0,0,0.6)" : "none"
            }} />
          </div>

          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            transform: isPressed ? "translateY(1px) scale(0.98)" : "none",
          }}>
            <div style={{
              height: "100%", width: "100%", borderRadius: "100px",
              boxShadow: isHovered ? "0 10px 20px rgba(0,0,0,0.3)" : "0 4px 10px rgba(0,0,0,0.2)",
              transition: "box-shadow 0.3s ease"
            }}>
              <div ref={shaderRef} className="shader-container-exploded" style={{ borderRadius: "100px", overflow: "hidden", height: "100%" }} />
            </div>
          </div>

          <button
            ref={buttonRef} onClick={handleClick}
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)} onMouseUp={() => setIsPressed(false)}
            className="absolute inset-0 z-[40] cursor-pointer bg-transparent border-none outline-none overflow-hidden rounded-[100px]"
            style={{ transform: "translateZ(25px)" }}
            aria-label={label}
          >
            {ripples.map((r) => (
              <span key={r.id} style={{
                position: "absolute", left: r.x, top: r.y,
                width: "20px", height: "20px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
                animation: "ripple-animation 0.6s ease-out"
              }} />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}