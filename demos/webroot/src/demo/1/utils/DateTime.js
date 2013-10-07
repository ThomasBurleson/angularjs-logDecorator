/**
 * DateTime utility class
 *
 * @author
 *
 */
(function( ){
    "use strict";

     var buildTimeString = function( date, fmt )
     {
         fmt = fmt || '%h:%m:%s:%z';

             function pad(value)
             {
                 return (value.toString().length < 2) ? '0' + value : value;
             }

         return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
             switch (fmtCode)
             {
                 case 'Y' :  return     date.getFullYear();
                 case 'M' :  return pad(date.getMonth() + 1);
                 case 'd' :  return pad(date.getDate());
                 case 'h' :  return pad(date.getHours());
                 case 'm' :  return pad(date.getMinutes());
                 case 's' :  return pad(date.getSeconds());
                 case 'z':   return pad(date.getMilliseconds());
                 default:
                     throw new Error('Unsupported format code: ' + fmtCode);
             }
         });
     }

     window.DateTime = {

         formattedNow : function()
         {
            return buildTimeString( new Date() );
         }
     };

})( );