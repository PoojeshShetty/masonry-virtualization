// App.jsx
import { useRef, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import MasonryLayoutTry from "./MasonryLayoutTry";

const debounce = (fun, delay) => {
  let timer;

  return function() {
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => fun() , delay);
  }
}
export default function App() {

  // state to trigger change to make api call.
  const [trigger, setTrigger] = useState(true);
  
  const [scrollTop, setScrollTop] = useState(0);
  const container = useRef(null);

  const scrollAction = (e) => {
    const el = container.current;
    
    if (!el) return;

    const atBottom =
      el.scrollHeight - el.scrollTop <= el.clientHeight + 2; // +2 tolerance
    if (atBottom) {
      console.log("Reached bottom!");
      setTrigger((prev) => !prev); // trigger API call 
    }
  };

  const debounceScroll = debounce(scrollAction, 200); // 200ms debounce
  // const onScroll = () => console.log("scrolled");
  return (
    <div style={{ width: "99%", height: '98vh', overflowY: 'scroll'}} ref={container}
      onScroll={(e) => {
        setScrollTop(e.target.scrollTop);
        debounceScroll();
      }}
    >
      <h1>Pinterest-like Masonry</h1>
      <MasonryLayoutTry columnCount={3} gap={16} triggerApiCall={trigger} scrollTop={scrollTop}/>
    </div>
  );
}
