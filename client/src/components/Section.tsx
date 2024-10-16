import React from 'react';

interface Props {
  txt: string,
  icon?: React.ReactNode,
  scheme: string
}
const Section = (props: Props)=> {
  return (
    <p
      className={`border-b-2 border-${props.scheme}-900 text-2xl text-${props.scheme}-950 font-thin`}
    >
      {props.txt}
      <span className="float-end">{props.icon}</span>
    </p>
  );
};

export default Section;
