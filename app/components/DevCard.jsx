"use client";

import React, { useEffect, useRef, useState } from "react";

export default function DevCard() {
  const cardRef = useRef(null);

  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  );

  const [glarePosition, setGlarePosition] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const resetCard = () => {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    );
    setGlarePosition((prev) => ({
      ...prev,
      opacity: 0,
    }));
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const isInsideCard =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInsideCard) {
        resetCard();
        return;
      }

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );

      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.6,
      });
    };

    const handleMouseLeaveBody = (e) => {
      const next = e.relatedTarget;
      if (!document.body.contains(next)) {
        resetCard();
      }
    };

    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeaveBody);

    return () => {
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeaveBody);
    };
  }, []);

  return (
    <div className="flex justify-center h-[32.5rem]">
      <div
        ref={cardRef}
        className="relative m-4 mt-8 w-fit self-stretch overflow-hidden rounded-[32px] transition-all duration-200 ease-out will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[32px] pointer-events-none z-50">
          <div
            className="absolute top-0 left-0 w-[200%] h-[200%] pointer-events-none transition-opacity duration-300 ease-out"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)`,
              transform: "translate(-25%, -25%)",
            }}
          />
        </div>

        <div
          className="flex h-fit rounded-[32px] p-2 w-[20.25rem] flex-col"
          style={{
            background:
              "linear-gradient(0deg, rgb(255, 255, 255), rgb(255, 255, 255)), linear-gradient(152.83deg, rgb(255, 255, 255) 51.92%, rgb(237, 240, 247) 85.8%)",
          }}
        >
          <div
            className="relative flex flex-col rounded-[24px] bg-cover p-2 pb-10"
            style={{
              backgroundImage:
                'url("https://media.daily.dev/image/upload/s--VMbOMIjj--/f_auto/v1710057765/public/DevCard-cover")',
            }}
          >
            <div
              className="absolute -inset-2 border-8 rounded-[32px]"
              style={{
                borderColor:
                  "color-mix(in srgb, rgb(168, 179, 207) 80%, transparent)",
              }}
            ></div>

            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocJOd0S3CS6Fdwq3HKhOe4JZ3VOrg2KBaC5v9yxl90fTJp3TJ_5w=s96-c"
              alt="avatar of Luis Fernando Juarez Peña"
              className="-rotate-3 border-white object-cover border-8 size-40 rounded-[48px]"
            />

            <span className="flex w-full flex-row gap-3 rounded-[16px] bg-[#1a1a1a] px-4 py-2 shadow-sm absolute bottom-0 left-0 translate-y-1/2 z-10">
              <span className="flex flex-col">
                <strong>
                  <h2 className="text-white text-lg leading-tight">10</h2>
                </strong>
                <span className="flex items-center text-gray-400 text-xs">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 mr-1 pointer-events-none text-gray-500"
                  >
                    <g fill="currentColor">
                      <path d="M12 3a9 9 0 110 18 9 9 0 010-18zm0 1.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z"></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.648 6.217a.74.74 0 01.172.776l-1.55 4.267h3.79a.74.74 0 01.523 1.263l-5.184 5.26a.74.74 0 01-1.218-.776l1.55-4.267H7.94a.74.74 0 01-.523-1.263l5.184-5.26a.74.74 0 011.046 0z"
                      ></path>
                    </g>
                  </svg>
                  Reputation
                </span>
              </span>

              <span className="flex flex-col">
                <strong>
                  <h2 className="text-white text-lg leading-tight">9</h2>
                </strong>
                <span className="flex items-center text-gray-400 text-xs">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 mr-1 pointer-events-none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm1.09-18.665l-.603-.77a.698.698 0 00-1.14.031c-1.12 1.635-.986 3.612-.206 5.09l.332.634.275.54.22.444.115.244.09.202.074.199c.192.6.134 1.221-.163 1.747-.449.78-1.178.963-1.864.845-1.123-.193-1.463-1.473-1.566-2.947l-.022-.388-.013-.394-.009-.593-.001-.585-.004-.136c-.037-.686-.377-.694-1.017-.025-1.796 1.875-2.099 4.749-.753 7.175 1.01 1.85 3.058 3.067 5.152 3.067.088 0 .178-.003.27-.007 2.166-.11 4.255-1.544 5.183-3.56a5.99 5.99 0 00.468-3.566c-.283-1.556-1.096-2.587-2.18-3.96a112.52 112.52 0 01-.392-.499l-.526-.663-.839-1.032-.88-1.093z"
                      fill="#FC538D"
                    ></path>
                  </svg>
                  Longest streak
                </span>
              </span>

              <span className="flex flex-col">
                <strong>
                  <h2 className="text-white text-lg leading-tight">32</h2>
                </strong>
                <span className="flex items-center text-gray-400 text-xs">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 mr-1 pointer-events-none text-green-500"
                  >
                    <path
                      d="M12 4.5c3.828 0 6.74 2.287 8.62 6.592l.139.326L21 12l-.241.582C18.885 17.097 15.924 19.5 12 19.5c-3.828 0-6.74-2.287-8.62-6.592l-.139-.326L3 12l.241-.582C5.115 6.903 8.076 4.5 12 4.5zm0 3.25a4.25 4.25 0 110 8.5 4.25 4.25 0 010-8.5z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  Posts read
                </span>
              </span>
            </span>
          </div>

          <div className="relative flex flex-1 flex-col justify-center gap-3 p-4 mt-4 rounded-b-[24px] pt-8 shadow-sm">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-bold text-gray-900 line-clamp-1 text-xl">
                Luis Fernando Juarez Peña
              </h2>
              <div className="line-clamp-1 flex items-center text-gray-500 text-xs">
                <span className="overflow-hidden text-ellipsis shrink">
                  @fernandogozu
                </span>
                <span className="mx-1 inline-block h-4 align-middle leading-4">
                  •
                </span>
                <time
                  title="Fri May 01 2026 17:06:51 GMT-05:00"
                  className="inline-block h-4 align-middle leading-4 text-gray-400"
                  dateTime="2026-05-01T22:06:51.660Z"
                >
                  May 01
                </time>
              </div>
            </div>

            <span className="h-px w-full bg-gray-200"></span>

            <div className="flex flex-wrap gap-2 max-h-[3.5rem] overflow-hidden pointer-events-none">
              {["ui-design", "webdev", "css", "java", "react"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center justify-center font-bold h-6 px-2 rounded-[8px] border border-gray-900 text-gray-900 text-xs bg-transparent"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex h-6 flex-row gap-1 pointer-events-none mt-1">
              <img
                className="object-cover w-6 h-6 rounded-full"
                loading="lazy"
                alt="Squad profile"
                src="https://media.daily.dev/image/upload/s--7lr6XGRA--/f_auto/v1735367756/avatars/avatar_UU1stgGJldM9pQP0QluF0"
              />
              <img
                className="object-cover w-6 h-6 rounded-full"
                loading="lazy"
                alt="Squad profile"
                src="https://media.daily.dev/image/upload/s--Nz8m8vMZ--/f_auto,q_auto/v1/squads/a1f0092b-0ee1-414b-82e6-f2c92d7335e4"
              />
              <img
                className="object-cover w-6 h-6 rounded-full"
                loading="lazy"
                alt="Squad profile"
                src="https://media.daily.dev/image/upload/s--WjakQDzh--/f_auto/v1767780462/squads/08dd2902-b9f8-408c-acbf-71199bb02df1?_a=BAMAMiZW0"
              />
              <img
                className="object-cover w-6 h-6 rounded-full"
                loading="lazy"
                alt="Squad profile"
                src="https://media.daily.dev/image/upload/s--ai0kromH--/f_auto,q_auto/v1698518496/squads/69088f45-3a20-4730-81c2-32d0d75fb8c6"
              />
              <img
                className="object-cover w-6 h-6 rounded-full"
                loading="lazy"
                alt="Squad profile"
                src="https://media.daily.dev/image/upload/s--rBhhosGv--/f_auto/v1732271142/squads/8a40a561-134b-4f88-bdb5-0f47215dccab"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}