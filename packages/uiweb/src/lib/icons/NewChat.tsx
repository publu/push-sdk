import React from 'react';

export const NewChatIcon = ({
  stroke,
  fill,
}: {
  stroke?: string;
  fill?: string;
}) => {
  return (
    <svg
      width="19"
      height="17"
      viewBox="0 0 19 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 17V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2V7.075C15.8333 7.04167 15.6667 7.02083 15.5 7.0125C15.3333 7.00417 15.1667 7 15 7C14.8333 7 14.6667 7.00417 14.5 7.0125C14.3333 7.02083 14.1667 7.04167 14 7.075V2H2V12H9.075C9.04167 12.1667 9.02083 12.3333 9.0125 12.5C9.00417 12.6667 9 12.8333 9 13C9 13.1667 9.00417 13.3333 9.0125 13.5C9.02083 13.6667 9.04167 13.8333 9.075 14H3L0 17ZM4 6H12V4H4V6ZM4 10H9V8H4V10ZM14 17V14H11V12H14V9H16V12H19V14H16V17H14Z"
        fill="#62626A"
      />
    </svg>
  );
};