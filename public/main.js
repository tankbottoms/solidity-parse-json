const contractAddress = '0x04d7aC55218Af46404bCCA1949039c7a1539d90d';

const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'ipfsGateway',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'ipfsHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'assetsJson',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'numElements',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'generateImage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCountTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getDataUri',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'image',
            type: 'string',
          },
        ],
        internalType: 'struct GenerateNft.TokenImage',
        name: 'tokenImage',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNames',
    outputs: [
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

document.addEventListener('DOMContentLoaded', async () => {
  const account = document.getElementById('dropdownUser1');

  if (typeof window.ethereum !== 'undefined') {
    // Auto connect wallet
    const [currentUser] = await ethereum.request({ method: 'eth_requestAccounts' });
    account.textContent = `${currentUser.slice(0, 5)}...${currentUser.slice(-3)}`;
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(abi, contractAddress);
    showImage(contract);

    document.getElementById('generate').addEventListener('click', async () => {
      const tx = await contract.methods.generateImage().send({ from: currentUser });

      console.log(tx);

      showImage(contract);
    });
  }
});

function showImage(contract) {
  const row = document.getElementById('row');
  row.innerHTML = '';
  contract.methods
    .getCountTokens()
    .call()
    .then((r) => {
      for (let index = 1; index <= +r; index++) {
        contract.methods
          .getDataUri(index)
          .call()
          .then((s) => {
            const svg = decodeURIComponent(escape(window.atob(s[0])));
            const col = document.createElement('div');
            col.classList.add('col');

            const card = document.createElement('div');
            card.classList.add('card');
            col.append(card);
            card.innerHTML = svg;
            row.append(col);
          });
      }
    });
}
