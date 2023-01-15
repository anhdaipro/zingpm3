import React from 'react';
import { useMemo } from 'react';

export const DOTS = '...';

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = totalCount

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

useEffect(() => {
  ( async ()=>{
      
      const res1 = await axios.get(zingchartURL,headers())
      setTopSongs(res1.data.topsongs)
      
      const data= res1.data.dashboard.map(item=>{
        return ({...item,day:dayjs(item.day).format("DD-MM-YYYY HH")})
      })
      setLabels(hours.map(item=>{
          return `${item.slice(-2)}:00`
      }))
      
      const datatop1 = data.filter(item=>item.song==res1.data.topsongs[0].id)
      const top1=hours.map((item,i)=>{
          if(datatop1.find(itemchoice=>itemchoice.day==item)){
              return datatop1.find(itemchoice=>itemchoice.day==item).count
          }
          return 0
      })
      if(res1.data.topsongs.length>1){
      const datatop2=data.filter(item=>item.song==res1.data.topsongs[1].id)
      const top2=hours.map((item,i)=>{
          if(datatop2.find(itemchoice=>itemchoice.day==item)){
              return datatop2.find(itemchoice=>itemchoice.day==item).count
          }
          return 0
      })
      setTop2(top2)
      }
      if(res1.data.topsongs.length>2){
      const datatop3=data.filter(item=>item.song==res1.data.topsongs[2].id)
      const top3=hours.map((item,i)=>{
          if(datatop3.find(itemchoice=>itemchoice.day==item)){
              return datatop3.find(itemchoice=>itemchoice.day==item).count
          }
          return 0
      })
      setTop3(top3)
      }
    
      setTop1(top1)
      
      
      const res2 = await axios.get(listartistURL,headers())
      const data2=res2.data
      setArtists(data2)
  })()
}, [])

useEffect(() => {
  ( async ()=>{
      const res = await axios.get(zingchartURL,headers())
      
      setSongs(res.data.topsongs)
      const data= res.data.dashboard.map(item=>{
        return ({...item,day:dayjs(item.day).format("DD-MM-YYYY HH")})
      })
      setLabels(hours.map(item=>{
          return `${item.slice(-2)}:00`
      }))
      setListvalues(res.data.songvalue)
      
      const datatop1 = data.filter(item=>item.song==res.data.topsongs[0].id)
      const top1=hours.map((item,i)=>{
          if(datatop1.find(itemchoice=>itemchoice.day==item)){
              return datatop1.find(itemchoice=>itemchoice.day==item).count
          }
          return 0
      })
      const datatop2=data.filter(item=>item.song==res.data.topsongs[1].id)
      const top2=hours.map((item,i)=>{
          if(datatop2.find(itemchoice=>itemchoice.day==item)){
              return datatop2.find(itemchoice=>itemchoice.day==item).count
          }
          return 0
      })
      const datatop3=res.data.topsongs.length>2?data.filter(item=>item.song==res.data.topsongs[2].id):[]
      const top3=hours.map((item,i)=>{
          if(datatop3.find(itemchoice=>itemchoice.day==item)){
              return datatop3.find(itemchoice=>itemchoice.day==item).count
          }
          return 0
      })
     
      setTop1(top1)
      setTop2(top2)
      setTop3(top3)
  })()
}, [])