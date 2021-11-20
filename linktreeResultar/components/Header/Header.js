import React from "react";
import style from "./Header.module.css";

export default function Header({ title, link, file_path }) {
  return (
    <>
      <header>
        <img
          className={style.profile}
          src={`${file_path}`}
          alt="RM"
        />
        <p className={style.username}>
          <a href={`${link}`}>{title}</a>
        </p>
      </header>
    </>
  );
}
