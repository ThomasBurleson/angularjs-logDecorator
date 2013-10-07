/**
 * DateTime utility class
 *
 * @author
 *
 */
(function( ){
    "use strict";


     define( [], function() {
         var buildTimeString = function( date, format )
         {
             format = format || '%h:%m:%s:%z';

                 function pad(value)
                 {
                     return (value.toString().length < 2) ? '0' + value : value;
                 }

             return format.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
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

         // Publish API for DateTime utils
         return {
             formattedNow : function()
             {
                return buildTimeString( new Date() );
             }
         };

     });

})( );