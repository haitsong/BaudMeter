using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;

/// <summary>
/// Summary description for CommandSign
/// </summary>
public class CommandSign
{
    public CommandSign() {}

    private const string privateXmlKey = "<RSAKeyValue><Modulus>oEH3ZgFZPXp4vKaovHEcdfH4GXTBtHszuBY/YHpzZtw6wSVRHTGyU0ymf2uLXIXcoNezfxxB71PacAuwEj9epKmuPSHqz8rsGhtR/m5TwASY0Cqxad6+5R8NQa/AZHkkt8T9qF9iRm66cFov3mbXgD4h2X2YjnCXldkHaJp76qk=</Modulus><Exponent>AQAB</Exponent><P>wsVxqw2x6VZtz3UgArAjk2xHfb3R0QKKdWB40Uke3kF5XvkQp/5VMRjC3dpLgmq+c178RcDbBqzcnCI9aiVBUw==</P><Q>0qL7UbahHinxXZGYOUu+W5Mpm/m2B3ji6ZqOptmo4ilZ68t945H2Koo6BSv6adorRGvfwQ3wxg/01R0qfBX4kw==</Q><DP>VmuzNtm5wjYGPVHT5T1wW55kzkcmTN4av2AR25LdLnLQvrI2kMPJ2yIIfNW6QWDJpnlT6ENdK8YRkPmkVG+5Xw==</DP><DQ>Q/hL2QZx32XxeRwuXu7OMoa+epKN5sNflbpGJhk+ohxt4+T6bqD/KqMILfsPB3FbXOzie02gUIl9m/eZagk8+Q==</DQ><InverseQ>bAoUT0Vr+MCP8KNkhHBmVMEDo5GgxLaNHPWeP5nvZAcq7HjcGGOs30U5ePW0yCPLNCyW3q7ExELd11S2NO2V4w==</InverseQ><D>CSnsfyk5lKHhsIvpHylqorXs5Wu/PdZDrVWcVyR5X9rdAzlii4RReaDq7mNUazx+UrYy3eRcQtatKXYJoel8vF+G5HGTY1P7X4uLw15SlvDuPbjnSQzpo7nYcPrIKPOJMa7pf/gUTEKZtzELsFvl8PSKmeDGhbo/4rY6ggvMnS8=</D></RSAKeyValue>";

    public static string DecryptString(string inputString)
    {
        int dwKeySize = 1024;
        RSACryptoServiceProvider rsaCryptoServiceProvider = new RSACryptoServiceProvider(dwKeySize);
        rsaCryptoServiceProvider.FromXmlString(privateXmlKey);
        int base64BlockSize = ((dwKeySize / 8) % 3 != 0) ? (((dwKeySize / 8) / 3) * 4) + 4 : ((dwKeySize / 8) / 3) * 4;
        int iterations = inputString.Length / base64BlockSize;
        List<Byte> arrayList = new List<Byte>();
        for (int i = 0; i < iterations; i++)
        {
            byte[] encryptedBytes = Convert.FromBase64String(inputString.Substring(base64BlockSize * i, base64BlockSize));
            // Be aware the RSACryptoServiceProvider reverses the order of encrypted bytes after encryption and before decryption.
            // If you do not require compatibility with Microsoft Cryptographic API (CAPI) and/or other vendors.
            // Comment out the next line and the corresponding one in the EncryptString function.
            Array.Reverse(encryptedBytes);
            arrayList.AddRange(rsaCryptoServiceProvider.Decrypt(encryptedBytes, true));
        }
        return Encoding.UTF32.GetString(arrayList.ToArray());
    }

    public static string GetHash(string ValueString, string hashKey)
    {
        string input = hashKey + ValueString;
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