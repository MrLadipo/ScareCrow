fetch(
  "https://us-east-1.quicksight.aws.amazon.com/sn/accounts/381492146542/dashboards/ef01ce56-9930-447c-805a-f2b44ae622eb?directory_alias=scarecrow-c6"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // Process your data here
    console.log(data);
  })
  .catch((error) => {
    // Handle the error
    console.error("There has been a problem with your fetch operation:", error);
  });
