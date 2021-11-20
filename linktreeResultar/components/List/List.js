import useSwr from "swr";
import Link from "next/link";
import style from './List.module.css';

export default function List({ links }) {

  return (
    <main>
      <div className="grid">
        <a target="_blank"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `${links.url}`;
          }} className={style.link}>{links.name}</a>
      </div>
    </main>
  );
}
