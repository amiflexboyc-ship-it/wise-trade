function Market(){

  const coins = [
    {
      name:"BTC / USDT",
      price:"$67,400",
      change:"+2.5%"
    },
    {
      name:"ETH / USDT",
      price:"$3,500",
      change:"+1.8%"
    },
    {
      name:"BNB / USDT",
      price:"$620",
      change:"-0.5%"
    },
    {
      name:"SOL / USDT",
      price:"$150",
      change:"+3.1%"
    }
  ];


  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
      p-6
    ">


      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        Markets
      </h1>



      <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-5
      ">


      {
        coins.map((coin)=>(

          <div
          key={coin.name}
          className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-5
          "
          >

            <h2>
              {coin.name}
            </h2>


            <p className="
              text-2xl
              font-bold
              mt-3
            ">
              {coin.price}
            </p>


            <p className="text-green-400 mt-2">
              {coin.change}
            </p>


          </div>

        ))
      }


      </div>


    </div>

  );

}


export default Market;