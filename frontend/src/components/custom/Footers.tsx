const Footers = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto py-6 px-4 sm:px-6 gap-4 sm:gap-0">
      {/* logo and contact */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3.5">
        {/* <img
          width={47}
          height={47}
          src={getPublicAbsoluteURL("svg/logo-two.svg")}
          alt="logo"
        /> */}
        <p className="text-white font-thin text-base sm:text-xl text-center sm:text-left">
          Contact Us
        </p>
      </div>

      {/* copyright */}
      <p className="text-white font-thin text-sm text-center sm:text-right">
        All rights reserved, Gateway 2025
      </p>
    </div>
  );
};

export default Footers;
