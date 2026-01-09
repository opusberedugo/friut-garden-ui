import React from "react";

export default function Divider({text}) {
    return (
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
        </div>

        <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">{text}</span>
        </div>
      </div>
    )
}