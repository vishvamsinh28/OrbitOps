"use client";

import { useEffect } from "react";

export function useLandingInteractions() {
useEffect(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const header = document.querySelector("header");
  const revealElements = document.querySelectorAll(".reveal");
  const countElements = document.querySelectorAll("[data-count]");
  const heroSection = document.querySelector(".hero-section");
  const tiltCards = document.querySelectorAll(
    ".tilt-card:not(.module-card)",
  );
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
}
