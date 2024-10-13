import React from 'react';

interface Props {
  txt: string,
  icon?: React.ReactNode,
  scheme: string
}
const Section = (props: Props)=> {
  return (
    <p
      className={`relative border-b-2 border-${props.scheme}-900 text-2xl text-${props.scheme}-950 font-thin`}
    >
      {props.txt}
      {props.icon}
    </p>
  );
};

export default Section;
