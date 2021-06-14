using AzureWorkshopFunctionApp.Interfaces;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System.Drawing.Imaging;
using System.Threading.Tasks;

namespace AzureWorkshopFunctionApp.Functions
{
    public class SquareImageQueueTrigger
    {
        private IBlobStorageService BlobStorageService { get; set; }
        private IImageService ImageService { get; set; }

        public SquareImageQueueTrigger(IImageService imageService, IBlobStorageService blobStorageService)
        {
            BlobStorageService = blobStorageService;
            ImageService = imageService;
        }

        [FunctionName("SquareImageQueueTrigger")]
        public async Task Run([QueueTrigger("squareimage", Connection = "AzureWebJobsStorage")]string imageName, ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed: {imageName}");

            var blobStream = await BlobStorageService.GetBlobAsStream("imagecontainer", imageName);

            var squareStream = ImageService.SquareImage(blobStream, ImageFormat.Jpeg);

            await BlobStorageService.UploadStreamToBlob("imagecontainer-square", imageName, squareStream);
        }
    }
}