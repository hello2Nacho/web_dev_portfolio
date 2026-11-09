"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

export const EASE_DYE = "expo.out";
export const EASE_CLOTH = "power3.inOut";

/** Scroll velocity (px/s, signed), updated by Lenis. Read in tickers. */
export const scrollState = { velocity: 0, progress: 0 };

export { gsap, ScrollTrigger, Flip, useGSAP };
