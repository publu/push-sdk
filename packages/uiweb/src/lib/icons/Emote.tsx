import React from 'react';

export const Emote = ({ color }: { color?: string }) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 21.25C16.5228 21.25 21 16.7728 21 11.25C21 5.72715 16.5228 1.25 11 1.25C5.47715 1.25 1 5.72715 1 11.25C1 16.7728 5.47715 21.25 11 21.25Z"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.2487 10.2083C7.82399 10.2083 8.29036 9.74196 8.29036 9.16667C8.29036 8.59137 7.82399 8.125 7.2487 8.125C6.6734 8.125 6.20703 8.59137 6.20703 9.16667C6.20703 9.74196 6.6734 10.2083 7.2487 10.2083Z"
        fill={color ?? '#8B5CF6'}
      />
      <path
        d="M13.5 9.16699H16"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.1654 13.75C14.3008 15.2448 12.8497 16.25 10.9987 16.25C9.14766 16.25 7.69661 15.2448 6.83203 13.75"
        stroke={color ?? '#8B5CF6'}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};