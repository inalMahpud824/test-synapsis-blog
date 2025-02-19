import { Spin } from "antd";

export function Loading(){
   return (
     <div className="w-full min-h-screen flex justify-center items-center absolute top-0 left-0 bg-white bg-opacity-50 z-50">
       <Spin size="large" />
     </div>
   );
}