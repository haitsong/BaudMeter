using System;
/*

 */

namespace com.BaudMeter.DNS
{
	public class RecordSSHFP : Record
	{
		public byte[] RDATA;

		public RecordSSHFP(RecordReader rr)
		{
			// re-read length
			ushort RDLENGTH = rr.ReadUInt16(-2);
			RDATA = rr.ReadBytes(RDLENGTH);
		}

		public override string ToString()
		{
			return string.Format("not-used");
		}

	}
}
