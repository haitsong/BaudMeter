using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;

namespace com.BaudMeter.Agent
{
    /// <summary>
    /// Summary description for CommandSign
    /// </summary>
    public class ReportPostSign
    {
        static private string ClientRandomHashKey = null;

        static ReportPostSign()
        {
            Random rand = new Random(DateTime.Now.Millisecond);
            string serverPublicKeyXml = "<RSAKeyValue><Modulus>oEH3ZgFZPXp4vKaovHEcdfH4GXTBtHszuBY/YHpzZtw6wSVRHTGyU0ymf2uLXIXcoNezfxxB71PacAuwEj9epKmuPSHqz8rsGhtR/m5TwASY0Cqxad6+5R8NQa/AZHkkt8T9qF9iRm66cFov3mbXgD4h2X2YjnCXldkHaJp76qk=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";
            ClientRandomHashKey = "" + rand.Next(int.MaxValue) + rand.Next(int.MaxValue) + rand.Next(int.MaxValue);
            PublicKeyEncryptedClientHashKey = EncryptString(ClientRandomHashKey, 1024, serverPublicKeyXml);
            com.BaudMeter.Agent.BaudMeterAgentService.WriteEvent("ClientKey=[" + ClientRandomHashKey + "] Encode=" + PublicKeyEncryptedClientHashKey);
        }

        private static string EncryptString(string inputString, int dwKeySize, string xmlString)
        {
            RSACryptoServiceProvider rsaCryptoServiceProvider = new RSACryptoServiceProvider(dwKeySize);
            rsaCryptoServiceProvider.FromXmlString(xmlString);
            int keySize = dwKeySize / 8;
            byte[] bytes = Encoding.UTF32.GetBytes(inputString);
            // The hash function in use by the .NET RSACryptoServiceProvider here is SHA1
            // int maxLength = ( keySize ) - 2 - ( 2 * SHA1.Create().ComputeHash( rawBytes ).Length );
            int maxLength = keySize - 42;
            int dataLength = bytes.Length;
            int iterations = dataLength / maxLength;
            StringBuilder stringBuilder = new StringBuilder();
            for (int i = 0; i <= iterations; i++)
            {
                byte[] tempBytes = new byte[(dataLength - maxLength * i > maxLength) ? maxLength : dataLength - maxLength * i];
                Buffer.BlockCopy(bytes, maxLength * i, tempBytes, 0, tempBytes.Length);
                byte[] encryptedBytes = rsaCryptoServiceProvider.Encrypt(tempBytes, true);
                // Be aware the RSACryptoServiceProvider reverses the order of encrypted bytes after encryption and before decryption.
                // If you do not require compatibility with Microsoft Cryptographic API (CAPI) and/or other vendors.
                // Comment out the next line and the corresponding one in the DecryptString function.
                Array.Reverse(encryptedBytes);
                // Why convert to base 64?
                // Because it is the largest power-of-two base printable using only ASCII characters
                stringBuilder.Append(Convert.ToBase64String(encryptedBytes));
            }
            return stringBuilder.ToString();
        }

        public static string PublicKeyEncryptedClientHashKey
        {
            get; private set;
        }

        public static string GetHash(string ValueString)
        {
            string input = ClientRandomHashKey + ValueString;
            using (MD5 md5Hash = MD5.Create())
            {
                // Convert the input string to a byte array and compute the hash.
                byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

                // Create a new Stringbuilder to collect the bytes
                // and create a string.
                StringBuilder sBuilder = new StringBuilder();

                // Loop through each byte of the hashed data 
                // and format each one as a hexadecimal string.
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }
                // Return the hexadecimal string.
                return sBuilder.ToString();
            }
        }

    }

}