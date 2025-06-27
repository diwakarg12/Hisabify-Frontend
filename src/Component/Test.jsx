/* eslint-disable no-unused-vars */

//#region imports
import React from 'react';
import LandingPage from '../Component/Pages/LandingPage/LandingPage';
//#endregion

//#region Component make Styles
//#endregion

//#region Function Component
const Test = () => {
  //#region Component states
  //#endregion

  //#region Component hooks
   React.useEffect(() => {
      // Anything in here is fired on component mount.
      return () => {
          // Anything in here is fired on component unmount.
      }
    }, [])

   React.useEffect(() => {
      // Anything in here is fired on component update.
   });
  //#endregion

  //#region Component use Styles
  //#endregion

  //#region Component validation methods
  //#endregion

  //#region Component Api methods
  //#endregion

  //#region Component feature methods
  //#endregion

  //#region Component JSX.members
  //#endregion

  //#region Component renders
  return(
    <LandingPage navkey={"test"}>
      <div className='bg-white p-8 h-[90vh] flex items-center flex-col'>
      <h1 className='font-bold text-4xl underline uppercase'>Welcome to Hisabify!!</h1>
      <p className='my-8'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ipsa mollitia suscipit, voluptatem, ex fugiat distinctio cum reiciendis tenetur tempora voluptas! Deleniti tenetur nihil, eos dolores sint magnam vel quidem non recusandae, necessitatibus molestias, aliquam asperiores modi fugiat consequatur quas corporis veniam quis eum at molestiae! Minima reprehenderit porro exercitationem! Modi dolorum obcaecati aut illo error aliquid fuga, id maxime eveniet. Accusantium ullam commodi aspernatur aut deleniti quam quas culpa a dignissimos eveniet, magni alias nostrum iusto! Veniam architecto, temporibus tempore aliquam ut quo corporis? Laudantium voluptas, doloribus dolore aspernatur accusantium dicta recusandae illo quos est. Amet possimus ab nihil?</p>
      </div>

    </LandingPage>
  );
  //#endregion
}
//#endregion

//#region Component export
export default Test;
//#endregion