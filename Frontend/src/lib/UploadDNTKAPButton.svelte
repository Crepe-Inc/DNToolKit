
<script lang="ts">
    import Base64 from "../b64";
    import jsonbi from "json-bigint";

    let fileForm: HTMLInputElement;

    
    import { backendSocket } from "../main";
  import { PacketNotify, PacketNotifyData, Sender } from "../websocket/WSPacket";
  import { PacketHead } from "../messages/PacketHead";
  import Long from "long";


	function uploadFile() {
		fileForm.click();
	}
    let files: FileList;

    $: if (files) {
		// Note that `files` is of type `FileList`, not an Array:
		// https://developer.mozilla.org/en-US/docs/Web/API/FileList

		for (const file of files) {
			send(file)
		}
	}
    
    function send(thing: File){
        console.log(thing.text())

        thing.text().then(data=>{
            let dataarr = data.split("█▄█\n").map(x=>
                {
                    try{
                        return jsonbi.parse(Base64.decode(x))
                    }catch{
                        return null
                    }
                }
            ).filter(x=>x!=null);
            
            var b = dataarr.map(x=>{
                
                const z : PacketNotifyData = {
                    PacketHead: {
                        "PacketId": 0,
                        "RpcId": 0,
                        "ClientSequenceId": 58,
                        "EnetChannelId": 0,
                        "EnetIsReliable": 1,
                        "SentMs": Long.fromValue(x.time || 0) || Long.ZERO,
                        "UserId": 0,
                        "UserIp": 0,
                        "UserSessionId": 0,
                        "RecvTimeMs": Long.ZERO,
                        "RpcBeginTimeMs": 0,
                        "ExtMap": {},
                        "SenderAppId": 0,
                        "SourceService": 0,
                        "TargetService": 0,
                        "ServiceAppIdMap": {},
                        "IsSetGameThread": false,
                        "GameThreadIndex": 0
                    },
                    PacketData: x.data || {} as object,
                    CmdID: x.cmd||"what" as string,
                    Sender: x.sender || 0 as Sender,
                }
                console.log(z)
                return z
            })
            backendSocket.emit("PacketNotify", {
                cmd: "PacketNotify",
                data: b
            })
        })



        
    }

</script>



<button title="Upload PCAP" data-icon="open-in-app" on:click={uploadFile}>Upload dntkap</button>
<input hidden type="file" bind:this={fileForm} bind:files accept=".dntkap"/>


{#if files}
	<h2>Selected files:</h2>
	{#each Array.from(files) as file}
		<p>{file.name} ({file.size} bytes) </p>
	{/each}
{/if}

<style>

</style>
  