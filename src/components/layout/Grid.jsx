import React from "react";

function Grid({classes='', children}){
  return (
    <div className={`grid ${classes}`}>
      {children}
    </div>
  )
}

export default Grid