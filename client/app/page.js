"use client";
import Image from "next/image";
import styles from "./page.module.css";
import LoginOrSignup from "@/login/page";
import Sidebar from "@/sidebar/page";

export default function Home() {
  return(
    <>
    <LoginOrSignup />
    </>
  )
}
