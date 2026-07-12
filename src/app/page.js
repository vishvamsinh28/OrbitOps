"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const header = document.querySelector("header");
    const revealElements = document.querySelectorAll(".reveal");
    const countElements = document.querySelectorAll("[data-count]");
    const heroSection = document.querySelector(".hero-section");
    const tiltCards = document.querySelectorAll(".tilt-card");
    const animationFrameIds = new Set();

    const animateCount = (element) => {
      if (element.dataset.counted === "true") return;

      element.dataset.counted = "true";

      const target = Number.parseInt(element.dataset.count || "0", 10);

      if (reducedMotion) {
        element.textContent = String(target);
        return;
      }

      let start = null;
      const duration = 900;

      const step = (timestamp) => {
        if (start === null) {
          start = timestamp;
        }

        const progress = Math.min((timestamp - start) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        element.textContent = String(Math.round(easedProgress * target));

        if (progress < 1) {
          const frameId = window.requestAnimationFrame(step);
          animationFrameIds.add(frameId);
        }
      };

      const frameId = window.requestAnimationFrame(step);
      animationFrameIds.add(frameId);
    };

    const handleScroll = () => {
      if (!header) return;

      if (window.scrollY > 8) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let observer;
    let countObserver;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px",
        },
      );

      revealElements.forEach((element) => {
        observer.observe(element);
      });

      countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.35,
          rootMargin: "0px 0px -24px 0px",
        },
      );

      countElements.forEach((element) => {
        countObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("in");
      });

      countElements.forEach(animateCount);
    }

    const handleHeroPointerMove = (event) => {
      if (!heroSection) return;

      const bounds = heroSection.getBoundingClientRect();
      const x =
        ((event.clientX - bounds.left) / bounds.width) * 100;
      const y =
        ((event.clientY - bounds.top) / bounds.height) * 100;

      heroSection.style.setProperty("--hx", `${x}%`);
      heroSection.style.setProperty("--hy", `${y}%`);
    };

    const tiltHandlers = [];

    if (finePointer && !reducedMotion) {
      heroSection?.addEventListener(
        "mousemove",
        handleHeroPointerMove,
      );

      tiltCards.forEach((card) => {
        const handlePointerMove = (event) => {
          const bounds = card.getBoundingClientRect();
          const x =
            (event.clientX - bounds.left) / bounds.width;
          const y =
            (event.clientY - bounds.top) / bounds.height;

          const rotateX = (0.5 - y) * 5;
          const rotateY = (x - 0.5) * 6;

          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);
        };

        const handlePointerLeave = () => {
          card.style.transform = "";
        };

        card.addEventListener("mousemove", handlePointerMove);
        card.addEventListener("mouseleave", handlePointerLeave);

        tiltHandlers.push({
          card,
          handlePointerMove,
          handlePointerLeave,
        });
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);

      heroSection?.removeEventListener(
        "mousemove",
        handleHeroPointerMove,
      );

      observer?.disconnect();
      countObserver?.disconnect();

      animationFrameIds.forEach((frameId) => {
        window.cancelAnimationFrame(frameId);
      });

      tiltHandlers.forEach(
        ({ card, handlePointerMove, handlePointerLeave }) => {
          card.removeEventListener(
            "mousemove",
            handlePointerMove,
          );
          card.removeEventListener(
            "mouseleave",
            handlePointerLeave,
          );
        },
      );
    };
  }, []);

  return (
    <main>
      <header className="sticky top-0 z-50 border-b border-[rgba(148,168,210,0.14)] bg-[rgba(8,11,20,0.82)] backdrop-blur-[14px]">
        <div className="relative z-[1] mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
          <nav className="flex items-center justify-between py-[18px]">
            <a
              href="#"
              className="flex items-center gap-2.5 font-display text-lg font-bold tracking-[0.02em]"
            >
              <span className="relative h-[26px] w-[26px] rounded-full border-[1.5px] border-[#FFB020]">
                <span className="animate-logo-orbit absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full bg-[#FFB020] shadow-[0_0_6px_#FFB020]" />
              </span>
              ORBITOPS
            </a>

            <div className="hidden items-center gap-[34px] text-sm text-[#8B98B4] min-[961px]:flex">
              <a
                href="#modules"
                className="transition-colors hover:text-[#E9EDF6]"
              >
                Modules
              </a>

              <a
                href="#lifecycle"
                className="transition-colors hover:text-[#E9EDF6]"
              >
                Lifecycle
              </a>

              <a
                href="#roles"
                className="transition-colors hover:text-[#E9EDF6]"
              >
                Roles
              </a>

              <a
                href="#workflow"
                className="transition-colors hover:text-[#E9EDF6]"
              >
                Workflow
              </a>
            </div>

            <a
              href="#cta"
              className="rounded-md border border-[rgba(148,168,210,0.28)] px-3 py-[9px] text-center font-mono text-[12px] leading-none transition-all hover:border-[#FFB020] hover:bg-[rgba(255,176,32,0.14)] hover:text-[#FFB020] min-[421px]:px-[18px] min-[421px]:text-[13px]"
            >
              <span className="min-[421px]:hidden">Walkthrough</span>
              <span className="hidden min-[421px]:inline">
                Request a walkthrough
              </span>
            </a>
          </nav>
        </div>
      </header>

      <section className="hero-section relative z-10 mx-auto grid max-w-[1180px] scroll-mt-[88px] grid-cols-1 items-center gap-10 px-5 py-[70px] min-[601px]:px-8 min-[961px]:grid-cols-[1.05fr_0.95fr] min-[961px]:pb-[70px] min-[961px]:pt-[88px]">
        <div className="hero-column relative z-[1]">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
            Enterprise Asset & Resource Management
          </span>

          <h1 className="my-[22px] max-w-[560px] font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.01em] min-[601px]:text-[38px] min-[961px]:text-[52px]">
            Every asset,{" "}
            <span className="hero-accent">
              tracked in real time
            </span>{" "}
            — not chased through spreadsheets.
          </h1>

          <p className="mb-[34px] max-w-[480px] text-[16.5px] text-[#8B98B4]">
            OrbitOps centralizes the full lifecycle of equipment,
            rooms, vehicles, and shared resources — who holds what,
            where it lives, and what condition it&apos;s in — so your
            team stops reconciling logs and starts trusting one system
            of record.
          </p>

          <div className="mb-11 flex flex-wrap gap-3.5">
            <a
              href="#modules"
              className="group inline-flex items-center gap-[9px] rounded-[7px] border border-transparent bg-[#FFB020] px-[22px] py-[13px] font-mono text-[13.5px] font-medium text-[#0A0E1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-12px_rgba(255,176,32,0.45)] transition-all hover:-translate-y-px hover:shadow-[0_0_0_4px_rgba(255,176,32,0.14),0_14px_28px_-12px_rgba(255,176,32,0.55)]"
            >
              Explore the modules
              <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
                →
              </span>
            </a>

            <a
              href="#workflow"
              className="group inline-flex items-center gap-[9px] rounded-[7px] border border-[rgba(148,168,210,0.28)] bg-[rgba(255,255,255,0.02)] px-[22px] py-[13px] font-mono text-[13.5px] font-medium transition-all hover:-translate-y-px hover:border-[#4FD1E8] hover:bg-[rgba(79,209,232,0.14)] hover:text-[#4FD1E8]"
            >
              See the workflow
              <span className="transition-transform duration-200 group-hover:translate-x-[3px]">
                →
              </span>
            </a>
          </div>

          <div className="hero-stat-grid border-t border-[rgba(148,168,210,0.14)] pt-[26px] font-mono text-xs text-[#586180]">
            <div className="hero-stat">
              <strong
                data-count="7"
                className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
              >
                0
              </strong>
              lifecycle states
            </div>

            <div className="hero-stat">
              <strong
                data-count="10"
                className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
              >
                0
              </strong>
              core modules
            </div>

            <div className="hero-stat">
              <strong
                data-count="4"
                className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
              >
                0
              </strong>
              role tiers
            </div>

            <div className="hero-stat">
              <strong
                data-count="0"
                className="mb-0.5 block font-display text-[22px] font-semibold text-[#E9EDF6]"
              >
                0
              </strong>
              spreadsheets
            </div>
          </div>
        </div>

        <div className="hero-column relative z-[1]">
          <div className="orbit-visual mx-auto max-w-[460px]">
            <svg
              className="relative block h-auto w-full overflow-visible"
              viewBox="0 0 480 480"
              role="img"
              aria-label="Diagram of four tracked assets in different lifecycle states orbiting the OrbitOps core"
            >
              <defs>
                <radialGradient
                  id="coreGlow"
                  cx="38%"
                  cy="32%"
                  r="75%"
                >
                  <stop offset="0%" stopColor="#1B2338" />
                  <stop offset="100%" stopColor="#0B0F1A" />
                </radialGradient>

                <linearGradient
                  id="sweepGrad"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="#4FD1E8"
                    stopOpacity="0"
                  />

                  <stop
                    offset="100%"
                    stopColor="#4FD1E8"
                    stopOpacity="0.16"
                  />
                </linearGradient>
              </defs>

              <circle
                cx="240"
                cy="240"
                r="80"
                fill="none"
                stroke="rgba(148,168,210,0.14)"
                strokeWidth="1"
              />

              <circle
                cx="240"
                cy="240"
                r="160"
                fill="none"
                stroke="rgba(148,168,210,0.28)"
                strokeWidth="1"
                strokeDasharray="3 6"
              />

              <circle
                cx="240"
                cy="240"
                r="225"
                fill="none"
                stroke="rgba(148,168,210,0.14)"
                strokeWidth="1"
              />

              <g className="radar-sweep">
                <path
                  d="M240,240 L240,15 A225,225 0 0,1 335.2,36.1 Z"
                  fill="url(#sweepGrad)"
                />
              </g>

              <line
                x1="353.1"
                y1="126.9"
                x2="381.4"
                y2="98.6"
                stroke="rgba(148,168,210,0.28)"
                strokeWidth="1"
              />

              <line
                x1="353.1"
                y1="353.1"
                x2="381.4"
                y2="381.4"
                stroke="rgba(148,168,210,0.28)"
                strokeWidth="1"
              />

              <line
                x1="126.9"
                y1="353.1"
                x2="98.6"
                y2="381.4"
                stroke="rgba(148,168,210,0.28)"
                strokeWidth="1"
              />

              <line
                x1="126.9"
                y1="126.9"
                x2="98.6"
                y2="98.6"
                stroke="rgba(148,168,210,0.28)"
                strokeWidth="1"
              />

              <circle
                className="pulse-node"
                cx="353.1"
                cy="126.9"
                r="5"
                fill="#FFB020"
              />

              <circle
                className="pulse-node pulse-node-two"
                cx="353.1"
                cy="353.1"
                r="5"
                fill="#3DDC97"
              />

              <circle
                className="pulse-node pulse-node-three"
                cx="126.9"
                cy="353.1"
                r="5"
                fill="#FF6B6B"
              />

              <circle
                className="pulse-node pulse-node-four"
                cx="126.9"
                cy="126.9"
                r="5"
                fill="#4FD1E8"
              />

              <circle
                cx="353.1"
                cy="126.9"
                r="5.5"
                fill="#FFB020"
                stroke="#080B14"
                strokeWidth="2"
              />

              <circle
                cx="353.1"
                cy="353.1"
                r="5.5"
                fill="#3DDC97"
                stroke="#080B14"
                strokeWidth="2"
              />

              <circle
                cx="126.9"
                cy="353.1"
                r="5.5"
                fill="#FF6B6B"
                stroke="#080B14"
                strokeWidth="2"
              />

              <circle
                cx="126.9"
                cy="126.9"
                r="5.5"
                fill="#4FD1E8"
                stroke="#080B14"
                strokeWidth="2"
              />

              <circle
                cx="240"
                cy="240"
                r="58"
                fill="url(#coreGlow)"
                stroke="rgba(148,168,210,0.28)"
                strokeWidth="1"
              />

              <text
                x="240"
                y="236"
                textAnchor="middle"
                className="fill-[#4FD1E8] font-mono text-[16px] tracking-[1.5px]"
              >
                ORBITOPS
              </text>

              <text
                x="240"
                y="254"
                textAnchor="middle"
                className="fill-[#4FD1E8] font-mono text-[12px] tracking-[1.5px]"
              >
                CORE
              </text>

              <text
                x="386"
                y="93"
                textAnchor="start"
                className="fill-[#E9EDF6] font-mono text-[11.5px]"
              >
                ORB-0114
              </text>

              <text
                x="386"
                y="106"
                textAnchor="start"
                className="fill-[#586180] font-mono text-[9.5px]"
              >
                allocated
              </text>

              <text
                x="386"
                y="392"
                textAnchor="start"
                className="fill-[#E9EDF6] font-mono text-[11.5px]"
              >
                ORB-0021
              </text>

              <text
                x="386"
                y="405"
                textAnchor="start"
                className="fill-[#586180] font-mono text-[9.5px]"
              >
                available
              </text>

              <text
                x="94"
                y="392"
                textAnchor="end"
                className="fill-[#E9EDF6] font-mono text-[11.5px]"
              >
                ORB-0077
              </text>

              <text
                x="94"
                y="405"
                textAnchor="end"
                className="fill-[#586180] font-mono text-[9.5px]"
              >
                maintenance
              </text>

              <text
                x="94"
                y="93"
                textAnchor="end"
                className="fill-[#E9EDF6] font-mono text-[11.5px]"
              >
                ROOM-B2
              </text>

              <text
                x="94"
                y="106"
                textAnchor="end"
                className="fill-[#586180] font-mono text-[9.5px]"
              >
                reserved
              </text>
            </svg>

            <div className="hero-float-card">
              <div className="mb-2.5 flex items-center gap-[7px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-[#586180]">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#3DDC97] shadow-[0_0_6px_#3DDC97]" />
                Live · today
              </div>

              <strong
                data-count="24"
                className="block font-display text-[27px] font-semibold leading-none"
              >
                0
              </strong>

              <span className="mt-[5px] block font-mono text-[10px] text-[#8B98B4]">
                asset events logged
              </span>

              <svg
                className="mt-3 block h-[26px] w-full"
                viewBox="0 0 120 28"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline
                  points="0,22 15,18 30,20 45,10 60,14 75,6 90,9 105,4 120,8"
                  fill="none"
                  stroke="#4FD1E8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </svg>
            </div>
          </div>

          <div className="mt-[22px] flex flex-wrap justify-center gap-4 font-mono text-[10.5px] text-[#586180]">
            <span className="inline-flex items-center gap-1.5">
              <i className="h-[7px] w-[7px] rounded-full bg-[#3DDC97] shadow-[0_0_6px_#3DDC97]" />
              Available
            </span>

            <span className="inline-flex items-center gap-1.5">
              <i className="h-[7px] w-[7px] rounded-full bg-[#FFB020] shadow-[0_0_6px_#FFB020]" />
              Allocated
            </span>

            <span className="inline-flex items-center gap-1.5">
              <i className="h-[7px] w-[7px] rounded-full bg-[#4FD1E8] shadow-[0_0_6px_#4FD1E8]" />
              Reserved
            </span>

            <span className="inline-flex items-center gap-1.5">
              <i className="h-[7px] w-[7px] rounded-full bg-[#FF6B6B] shadow-[0_0_6px_#FF6B6B]" />
              Maintenance
            </span>
          </div>
        </div>
      </section>

      <div className="ticker-strip" aria-hidden="true">
        <div className="ticker-track">
          <span className="ticker-item">
            <i className="ticker-dot bg-[#3DDC97]" />
            ORB-0021 checked in <b>·</b> condition noted, status
            Available
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#FFB020]" />
            ORB-0114 allocated <b>·</b> Engineering, expected return
            08 Aug
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#4FD1E8]" />
            Room B2 booked <b>·</b> 10:00–11:00, no overlap detected
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#FF6B6B]" />
            ORB-0077 maintenance approved <b>·</b> technician
            assigned
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#9C8CFF]" />
            Transfer request <b>·</b> awaiting Department Head
            sign-off
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#FF6B6B]" />
            Overdue return flagged <b>·</b> ORB-0142, 3 days past due
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#3DDC97]" />
            Audit cycle Q3 closed <b>·</b> 2 discrepancies logged
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#3DDC97]" />
            ORB-0021 checked in <b>·</b> condition noted, status
            Available
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#FFB020]" />
            ORB-0114 allocated <b>·</b> Engineering, expected return
            08 Aug
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#4FD1E8]" />
            Room B2 booked <b>·</b> 10:00–11:00, no overlap detected
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#FF6B6B]" />
            ORB-0077 maintenance approved <b>·</b> technician
            assigned
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#9C8CFF]" />
            Transfer request <b>·</b> awaiting Department Head
            sign-off
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#FF6B6B]" />
            Overdue return flagged <b>·</b> ORB-0142, 3 days past due
          </span>

          <span className="ticker-item">
            <i className="ticker-dot bg-[#3DDC97]" />
            Audit cycle Q3 closed <b>·</b> 2 discrepancies logged
          </span>
        </div>
      </div>

      <div className="relative z-10 border-y border-[rgba(148,168,210,0.14)] py-[30px]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 px-5 min-[601px]:grid-cols-2 min-[601px]:px-8 min-[961px]:grid-cols-4">
          <div className="stat reveal">
            <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
              Available → Allocated
            </strong>

            <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
              Conflict-checked before assignment
            </span>
          </div>

          <div className="stat reveal">
            <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
              Overlap validation
            </strong>

            <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
              Bookings rejected on time-slot collision
            </span>
          </div>

          <div className="stat reveal">
            <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
              Approval-gated repairs
            </strong>

            <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
              Status flips only after sign-off
            </span>
          </div>

          <div className="stat reveal">
            <strong className="mb-1 block font-display text-[24px] font-semibold text-[#E9EDF6] min-[961px]:text-[30px]">
              Locked audit cycles
            </strong>

            <span className="font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#586180]">
              Discrepancy reports generated automatically
            </span>
          </div>
        </div>
      </div>

      <section
        id="modules"
        className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
          <div className="section-heading reveal mb-14 max-w-[620px]">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
              Platform
            </span>

            <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
              Ten modules. One system of record.
            </h2>

            <p className="text-[15.5px] text-[#8B98B4]">
              From onboarding a department to closing an audit cycle,
              every workflow lives in the same place — no handoffs
              between spreadsheets, email threads, and paper logs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-[rgba(148,168,210,0.14)] min-[601px]:grid-cols-2 min-[961px]:grid-cols-3">
            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "0ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 01
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Login & signup
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Every signup creates an employee account only —
                elevated roles can only be granted later, from the
                directory, never chosen at signup.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "40ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3.5"
                    y="3.5"
                    width="7"
                    height="7"
                    rx="1.2"
                  />
                  <rect
                    x="13.5"
                    y="3.5"
                    width="7"
                    height="7"
                    rx="1.2"
                  />
                  <rect
                    x="3.5"
                    y="13.5"
                    width="7"
                    height="7"
                    rx="1.2"
                  />
                  <rect
                    x="13.5"
                    y="13.5"
                    width="7"
                    height="7"
                    rx="1.2"
                  />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 02
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Dashboard
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                KPI cards for availability, allocations, active
                bookings, and pending transfers, with overdue returns
                broken out from what&apos;s simply upcoming.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "80ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3.5 3.5 8 12 12.5 20.5 8Z" />
                  <path d="M3.5 12 12 16.5 20.5 12" />
                  <path d="M3.5 16 12 20.5 20.5 16" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 03
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Organization setup
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Admin-only control over departments, asset categories,
                and the employee directory — including who gets
                promoted to Department Head or Asset Manager.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.6 3.5H20v7.4L11 20 3.9 12.9Z" />
                  <circle cx="16.3" cy="7.7" r="1.3" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 04
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Asset registry
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Register assets with auto-generated tags, search by
                tag, serial, or QR code, and see allocation and
                maintenance history in one record.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "160ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 8h13.5M17.5 8 14 4.5M17.5 8 14 11.5" />
                  <path d="M20 16H6.5M6.5 16 10 12.5M6.5 16 10 19.5" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 05
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Allocation & transfer
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Double allocation is blocked outright — a held asset
                routes the requester into a transfer request instead
                of overwriting the current holder.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="15"
                    rx="1.6"
                  />
                  <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 06
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Resource booking
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Calendar-based booking for shared resources, with
                overlap validation down to the minute a slot begins.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "240ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 6.5a3.6 3.6 0 0 0-4.8 4.3L4 16.5 5.5 18l5.7-5.7a3.6 3.6 0 0 0 4.3-4.8l-2.3 2.3-1.7-1.7Z" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 07
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Maintenance
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Requests move through approval before repair starts —
                the asset flips to Under Maintenance automatically,
                and back once resolved.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "280ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="5"
                    y="4"
                    width="14"
                    height="17"
                    rx="1.4"
                  />
                  <path d="M9 3.5h6v2H9zM8.3 12.3l2 2 4.4-4.4" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 08
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Audit cycles
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Scoped by department or location, worked by assigned
                auditors, and closed into a locked record with an
                auto-generated discrepancy report.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "320ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 20V10M10 20V6.5M16 20v-8M20.5 20V4" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 09
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Reports & analytics
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Utilization trends, idle assets, maintenance
                frequency, and a booking heatmap — exportable for the
                meetings spreadsheets used to be for.
              </p>
            </article>

            <article
              className="module-card tilt-card reveal bg-[#111725] px-[26px] py-[30px]"
              style={{ transitionDelay: "360ms" }}
            >
              <div className="module-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 17v-5.5a6 6 0 0 1 12 0V17l1.8 2.2H4.2Z" />
                  <path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0" />
                </svg>
              </div>

              <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-[#586180]">
                MODULE 10
              </span>

              <h3 className="mb-[9px] font-display text-[17px] font-semibold">
                Logs & notifications
              </h3>

              <p className="text-[13.5px] text-[#8B98B4]">
                Every action — who, what, when — plus alerts for
                overdue returns, bookings, transfers, and flagged
                audit discrepancies.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="lifecycle"
        className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
          <div className="section-heading reveal mb-14 max-w-[620px]">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
              Lifecycle
            </span>

            <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
              Every asset carries a single, honest status.
            </h2>

            <p className="text-[15.5px] text-[#8B98B4]">
              Status changes only happen through defined transitions
              — never a manual overwrite — so the record on screen
              matches what&apos;s actually true in the building.
            </p>
          </div>

          <div className="lifecycle-panel reveal rounded-2xl border border-[rgba(148,168,210,0.14)] px-5 py-10 min-[601px]:px-10 min-[601px]:py-12">
            <div className="mt-3 flex flex-wrap items-center justify-center">
              <div className="life-node">
                <i className="text-[#3DDC97]">
                  <span className="block h-[7px] w-[7px] rounded-full bg-[#3DDC97]" />
                </i>
                Available
              </div>

              <span className="px-3 text-base text-[#586180]">
                ⇄
              </span>

              <div className="life-node">
                <i className="text-[#FF6B6B]">
                  <span className="block h-[7px] w-[7px] rounded-full bg-[#FF6B6B]" />
                </i>
                Under Maintenance
              </div>

              <span className="px-3 text-base text-[#586180]">
                →
              </span>

              <div className="life-node">
                <i className="text-[#3DDC97]">
                  <span className="block h-[7px] w-[7px] rounded-full bg-[#3DDC97]" />
                </i>
                Available
              </div>

              <span className="px-3 text-base text-[#586180]">
                →
              </span>

              <div className="life-node">
                <i className="text-[#FFB020]">
                  <span className="block h-[7px] w-[7px] rounded-full bg-[#FFB020]" />
                </i>
                Allocated
              </div>

              <span className="px-3 text-base text-[#586180]">
                →
              </span>

              <div className="life-node">
                <i className="text-[#3DDC97]">
                  <span className="block h-[7px] w-[7px] rounded-full bg-[#3DDC97]" />
                </i>
                Available
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-5 border-t border-[rgba(148,168,210,0.14)] pt-6 min-[961px]:grid-cols-2">
              <div className="text-[13.5px] text-[#8B98B4]">
                <strong className="mb-1.5 block font-mono text-xs tracking-[0.04em] text-[#E9EDF6]">
                  RESERVED & LOST
                </strong>

                Shared resources move to Reserved on booking; an asset
                an auditor can&apos;t locate is marked Lost and flows
                into the discrepancy report.
              </div>

              <div className="text-[13.5px] text-[#8B98B4]">
                <strong className="mb-1.5 block font-mono text-xs tracking-[0.04em] text-[#E9EDF6]">
                  RETIRED & DISPOSED
                </strong>

                End-of-life states close out the asset&apos;s record
                while its full allocation and maintenance history
                stays intact.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="roles"
        className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
          <div className="section-heading reveal mb-14 max-w-[620px]">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
              Access
            </span>

            <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
              Four roles, scoped to what each one should touch.
            </h2>

            <p className="text-[15.5px] text-[#8B98B4]">
              Nobody signs up into power. Roles are granted
              deliberately, and every screen respects the boundary.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[18px] min-[601px]:grid-cols-2 min-[961px]:grid-cols-4">
            <article
              className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
              style={{
                "--role-color": "var(--amber)",
                transitionDelay: "0ms",
              }}
            >
              <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
                TIER 01
              </span>

              <h3 className="mb-3.5 font-display text-[17px] font-semibold">
                Admin
              </h3>

              <ul className="flex list-none flex-col gap-[9px]">
                <li className="role-list-item">
                  Manages departments & categories
                </li>
                <li className="role-list-item">
                  Runs audit cycles
                </li>
                <li className="role-list-item">
                  Grants Department Head & Asset Manager roles
                </li>
                <li className="role-list-item">
                  Views org-wide analytics
                </li>
              </ul>
            </article>

            <article
              className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
              style={{
                "--role-color": "var(--cyan)",
                transitionDelay: "80ms",
              }}
            >
              <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
                TIER 02
              </span>

              <h3 className="mb-3.5 font-display text-[17px] font-semibold">
                Asset Manager
              </h3>

              <ul className="flex list-none flex-col gap-[9px]">
                <li className="role-list-item">
                  Registers & allocates assets
                </li>
                <li className="role-list-item">
                  Approves transfers & returns
                </li>
                <li className="role-list-item">
                  Approves maintenance requests
                </li>
                <li className="role-list-item">
                  Resolves audit discrepancies
                </li>
              </ul>
            </article>

            <article
              className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
              style={{
                "--role-color": "var(--green)",
                transitionDelay: "160ms",
              }}
            >
              <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
                TIER 03
              </span>

              <h3 className="mb-3.5 font-display text-[17px] font-semibold">
                Department Head
              </h3>

              <ul className="flex list-none flex-col gap-[9px]">
                <li className="role-list-item">
                  Views department-held assets
                </li>
                <li className="role-list-item">
                  Approves department allocations
                </li>
                <li className="role-list-item">
                  Approves department transfers
                </li>
                <li className="role-list-item">
                  Books shared resources
                </li>
              </ul>
            </article>

            <article
              className="role-card tilt-card reveal rounded-[14px] border border-[rgba(148,168,210,0.14)] bg-gradient-to-b from-[#111725] to-[#0D1220] px-[22px] py-7"
              style={{
                "--role-color": "var(--violet)",
                transitionDelay: "240ms",
              }}
            >
              <span className="role-level mb-3 block font-mono text-[10.5px] tracking-[0.1em]">
                TIER 04
              </span>

              <h3 className="mb-3.5 font-display text-[17px] font-semibold">
                Employee
              </h3>

              <ul className="flex list-none flex-col gap-[9px]">
                <li className="role-list-item">
                  Views assets allocated to them
                </li>
                <li className="role-list-item">
                  Books shared resources
                </li>
                <li className="role-list-item">
                  Raises maintenance requests
                </li>
                <li className="role-list-item">
                  Initiates returns & transfers
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="relative z-10 scroll-mt-[88px] py-[70px] min-[961px]:py-[100px]"
      >
        <div className="mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
          <div className="section-heading reveal mb-14 max-w-[620px]">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
              End to end
            </span>

            <h2 className="mb-3.5 mt-4 font-display text-[36px] font-semibold tracking-[-0.01em]">
              How an asset moves through OrbitOps.
            </h2>

            <p className="text-[15.5px] text-[#8B98B4]">
              The same sequence, whether it&apos;s a laptop, a fleet
              vehicle, or a conference room.
            </p>
          </div>

          <div className="timeline relative max-w-[760px] pl-9">
            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                01
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Setup.
                </strong>{" "}
                Admin creates departments and asset categories, then
                promotes selected employees to Department Head or
                Asset Manager.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                02
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Registration.
                </strong>{" "}
                Asset Manager registers a new asset; it enters the
                system as Available.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                03
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Allocation.
                </strong>{" "}
                The asset is assigned to a person or department — an
                existing allocation blocks the request and offers a
                transfer instead.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                04
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Or, shared use.
                </strong>{" "}
                The asset can instead be marked bookable, opening it
                to time-slot reservations.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                05
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Booking.
                </strong>{" "}
                Employees reserve shared resources; overlapping
                requests are rejected automatically.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                06
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Maintenance.
                </strong>{" "}
                A holder raises a request, which must be approved
                before repair work — and the status change — begins.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                07
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Transfers & returns.
                </strong>{" "}
                Assets move as organizational needs change; returns
                past their expected date are flagged overdue
                automatically.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                08
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Audit.
                </strong>{" "}
                Cycles are scheduled, auditors assigned, assets
                verified, and discrepancy reports generated before
                the cycle locks.
              </p>
            </div>

            <div className="timeline-step reveal">
              <span className="mb-[5px] block font-mono text-[11px] text-[#586180]">
                09
              </span>

              <p className="max-w-[600px] text-sm text-[#8B98B4]">
                <strong className="font-medium text-[#E9EDF6]">
                  Visibility.
                </strong>{" "}
                Every step surfaces through notifications, activity
                logs, the dashboard, and exportable reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="cta-glow relative z-10 scroll-mt-[88px] border-y border-[rgba(148,168,210,0.14)] py-24 text-center"
      >
        <div className="relative mx-auto max-w-[1180px] px-5 min-[601px]:px-8">
          <span className="inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#4FD1E8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4FD1E8] shadow-[0_0_8px_#4FD1E8]" />
            Ready when you are
          </span>

          <h2 className="mx-auto mb-4 mt-4 max-w-[620px] font-display text-[38px] font-semibold tracking-[-0.01em]">
            Stop tracking assets by memory and spreadsheet.
          </h2>

          <p className="mx-auto mb-[34px] max-w-[480px] text-[#8B98B4]">
            OrbitOps gives every department one shared, accurate
            answer to &quot;who has this, and where is it.&quot;
          </p>

          <div className="flex flex-wrap justify-center gap-3.5">
            <a
              href="#modules"
              className="inline-flex items-center rounded-[7px] border border-transparent bg-[#FFB020] px-[22px] py-[13px] font-mono text-[13.5px] font-medium text-[#0A0E1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-12px_rgba(255,176,32,0.45)] transition-all hover:-translate-y-px hover:shadow-[0_0_0_4px_rgba(255,176,32,0.14),0_14px_28px_-12px_rgba(255,176,32,0.55)]"
            >
              Explore the modules
            </a>

            <a
              href="#roles"
              className="inline-flex items-center rounded-[7px] border border-[rgba(148,168,210,0.28)] bg-[rgba(255,255,255,0.02)] px-[22px] py-[13px] font-mono text-[13.5px] font-medium transition-all hover:-translate-y-px hover:border-[#4FD1E8] hover:bg-[rgba(79,209,232,0.14)] hover:text-[#4FD1E8]"
            >
              See role access
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-11">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3.5 px-5 font-mono text-[12.5px] text-[#586180] min-[601px]:px-8">
          <span>ORBITOPS — ASSET & RESOURCE MANAGEMENT</span>

          <div className="flex gap-[22px]">
            <a
              href="#modules"
              className="transition-colors hover:text-[#4FD1E8]"
            >
              Modules
            </a>

            <a
              href="#lifecycle"
              className="transition-colors hover:text-[#4FD1E8]"
            >
              Lifecycle
            </a>

            <a
              href="#roles"
              className="transition-colors hover:text-[#4FD1E8]"
            >
              Roles
            </a>

            <a
              href="#workflow"
              className="transition-colors hover:text-[#4FD1E8]"
            >
              Workflow
            </a>
          </div>

          <span>BUILT FOR THE TRACK</span>
        </div>
      </footer>
    </main>
  );
}
