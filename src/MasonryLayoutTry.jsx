import { useEffect, useMemo, useRef, useState } from "react";


const FIXED_WIDTH = 250;
function MasonryLayoutTry({ columnCount, gap = 16, triggerApiCall, scrollTop}) {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [positions, setPositions] = useState([]);
    const [heights, setHeights] = useState(Array(columnCount).fill(0));
    const containerRef = useRef(null);

    const containerHeight = useMemo(
    () => Math.max(...heights),
    [heights, scrollTop]
  );
  const totalHeight = containerHeight;
  const rowHeight = Math.floor(totalHeight / Math.ceil(positions.length / columnCount)) * 2 || 160;
  const visibleItemsLength = Math.floor(containerHeight / rowHeight) * columnCount
  //   Current scroll position of the container
  // Get the first element to be displayed
  const startNodeElem = Math.floor(scrollTop / rowHeight);
  // Get the items to be displayed
  const visibleItems = positions?.slice(
    startNodeElem,
    startNodeElem + visibleItemsLength
  );
  //  Add padding to the empty space
  const offsetY = Math.floor(startNodeElem /columnCount) * rowHeight;
  console.log({visibleItems, offsetY, startNodeElem, visibleItemsLength, totalHeight, rowHeight, scrollTop, positions, heights})


    useEffect(() => {
        console.log("call load more")
        if(!loading) loadMore();
    }, [triggerApiCall])

    const loadMore = async () => {
        setLoading(true);
        const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
        const data = await res.json();
        setPage(page+1);
        setLoading(false);

        const adjusted = data.map(img => {
            return {
                ...img,
                width: FIXED_WIDTH,
                height: Math.floor((img.height / img.width) * FIXED_WIDTH),
                url: img.download_url
            }
        })
        let getHeights = heights;
        const adjustedHeights = adjusted.map(img => {

            const minCol = getHeights.indexOf(Math.min(...getHeights));
            const x = minCol * (FIXED_WIDTH + gap);
            const y = getHeights[minCol];
            getHeights[minCol] += img.height + gap;

            return {...img, x, y, width: FIXED_WIDTH, height: img.height}
        })
        setHeights([...getHeights]);
        console.log({positions})
        setPositions((prev) => [...prev, ...adjustedHeights]);
        setImages((prev) => [...prev, ...adjusted]);
    }

    return (
        <div style={{ width: '100%'}}>
            <div
              style={{
                position: "relative",
                width: columnCount * (FIXED_WIDTH + gap) - gap,
                height: Math.max(...heights),
                margin: "0 auto",
                transform: `translateY(${offsetY}px)`,
                border: '1px solid red'
              }}
              ref={containerRef}
            >
                {visibleItems?.map((img, idx) => (
                    <div 
                        key={img.id}
                        style={{ 
                            position: 'absolute',
                            width: img.width,
                            height: img.height,
                            transform: `translate(${img.x || 0}px, ${img.y || 0}px)`,
                            transition: 'transform 0.3s ease'
                        }}
                        >
                        <img src={img.url} alt={img.author} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                    </div>
                ))}
            </div>
            {/* <button onClick={loadMore}>Load More</button> */}
        </div>
    )
}

export default MasonryLayoutTry