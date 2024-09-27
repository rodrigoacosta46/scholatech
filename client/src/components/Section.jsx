const Section = ({ txt, icon = '', scheme }) => {
  return (
    <p
      className={`relative border-b-2 border-${scheme}-900 text-2xl text-${scheme}-950 font-thin`}
    >
      {txt}
      {icon}
    </p>
  );
};

export default Section;
