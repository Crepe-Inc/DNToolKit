
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
        //unfortunately this has an issue...
        //it inputs the packets so fast that it can miss some data parsing


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
                        "ClientSequenceId": 0,
                        "EnetChannelId": 0,
                        "EnetIsReliable": 1,
                        "SentMs": Long.fromValue(x.time || x.PacketHead.SentMs||0 ) || Long.ZERO,
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
                    PacketData: x.data || x.PacketData as object,
                    CmdID: x.cmd || x.CmdID as string,
                    Sender: x.sender || x.Sender as Sender,
                }

                backendSocket.emit("PacketNotify", {
                    cmd: "PacketNotify",
                    data: [z]
                })
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
  