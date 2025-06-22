
function formattedDate(ISOdate) {
     const date = new Date(ISOdate);
     const formatted = new Intl.DateTimeFormat('en-PH', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Manila',
        }).format(date);
     return formatted
}


export default formattedDate