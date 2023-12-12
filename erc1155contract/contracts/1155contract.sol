
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC1155 {
    function safeTransferFrom( address from,address to, uint256 id,uint256 value, bytes calldata data) external;
    function safeBatchTransferFrom( address from,address to, uint256[] calldata ids,  uint256[] calldata values, bytes calldata data ) external;
    function balanceOf(address owner, uint256 id) external view returns (uint256);
    function balanceOfBatch(address[] calldata owners, uint256[] calldata ids ) external view returns (uint256[] memory);
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll( address owner, address operator ) external view returns (bool);
}
 interface IERC1155TokenReceiver {
     function onERC1155Received( address operator, address from, uint256 id, uint256 value, bytes calldata data ) external returns (bytes4);
     function onERC1155BatchReceived(address operator,address from,uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external returns (bytes4);
}


contract ERC1155 is IERC1155 {
    bytes32 internal constant ERC1155NAMESPACE = keccak256('ERC1155');

    function getERC1155Storage() internal pure returns(ERC1155DATA storage s) {
        bytes32 position = ERC1155NAMESPACE;
        assembly {
            s.slot := position
        }
    }

     struct ERC1155DATA {
         // owner => id => balance
    mapping(address => mapping(uint256 => uint256))  balanceOf;
    // owner => operator => approved
    mapping(address => mapping(address => bool))  isApprovedForAll;
    }

    event TransferSingle( address indexed operator, address indexed from, address indexed to, uint256 id,  uint256 value   );
    event TransferBatch( address indexed operator, address indexed from,address indexed to,uint256[] ids,uint256[] values );
    event ApprovalForAll(address indexed owner,address indexed operator,bool approved );
    event URI(string value, uint256 indexed id);
    

    function balanceOfBatch(  address[] calldata owners, uint256[] calldata ids) external view returns (uint256[] memory balances) {
        ERC1155DATA storage s = getERC1155Storage();
        require(owners.length == ids.length, "owners length != ids length");
        balances = new uint[](owners.length);
        unchecked {
            for (uint256 i = 0; i < owners.length; i++) {
                balances[i] =s.balanceOf[owners[i]][ids[i]];
            }
        }
    }

    function setApprovalForAll(address operator, bool approved) external {
        ERC1155DATA storage s = getERC1155Storage();
        s.isApprovedForAll[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function safeTransferFrom( address from, address to,uint256 id,  uint256 value, bytes calldata data ) external {
        ERC1155DATA storage s = getERC1155Storage();
        require(
            msg.sender == from || s.isApprovedForAll[from][msg.sender],
            "not approved"
        );
        require(to != address(0), "to = 0 address");

        s.balanceOf[from][id] -= value;
        s.balanceOf[to][id] += value;

        emit TransferSingle(msg.sender, from, to, id, value);

        if (to.code.length > 0) {
            require(
                IERC1155TokenReceiver(to).onERC1155Received(
                    msg.sender,
                    from,
                    id,
                    value,
                    data
                ) == IERC1155TokenReceiver.onERC1155Received.selector,
                "unsafe transfer"
            );
        }
    }
    function safeBatchTransferFrom( address from, address to, uint256[] calldata ids, uint256[] calldata values, bytes calldata data ) external {
        ERC1155DATA storage s = getERC1155Storage();
        require(
            msg.sender == from || s.isApprovedForAll[from][msg.sender],
            "not approved"
        );
        require(to != address(0), "to = 0 address");
        require(ids.length == values.length, "ids length != values length");

        for (uint256 i = 0; i < ids.length; i++) {
           s.balanceOf[from][ids[i]] -= values[i];
           s.balanceOf[to][ids[i]] += values[i];
        }

        emit TransferBatch(msg.sender, from, to, ids, values);

        if (to.code.length > 0) {
            require(
                IERC1155TokenReceiver(to).onERC1155BatchReceived(
                    msg.sender,
                    from,
                    ids,
                    values,
                    data
                ) == IERC1155TokenReceiver.onERC1155BatchReceived.selector,
                "unsafe transfer"
            );
        }
    }
    function balanceOf(address owner, uint256 id) external view returns (uint256) {
        ERC1155DATA storage s = getERC1155Storage();
        return s.balanceOf[owner][id];

    }

    function isApprovedForAll(address owner, address operator) external view returns (bool) {
        ERC1155DATA storage s = getERC1155Storage();
        return s.isApprovedForAll[owner][operator];
    }
    
     // ERC165
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165 Interface ID for ERC165
            interfaceId == 0xd9b67a26 || // ERC165 Interface ID for ERC1155
            interfaceId == 0x0e89341c; // ERC165 Interface ID for ERC1155MetadataURI
    }
    
    // ERC1155 Metadata URI
    function uri(uint256 id) public view virtual returns (string memory) {}

    // Internal functions
    function _mint(address to, uint256 id, uint256 value, bytes memory data) internal {
        ERC1155DATA storage s = getERC1155Storage();
        require(to != address(0), "to = 0 address");
        s.balanceOf[to][id] += value;
        emit TransferSingle(msg.sender, address(0), to, id, value);
        if (to.code.length > 0) {
            require(
                IERC1155TokenReceiver(to).onERC1155Received(
                    msg.sender,
                    address(0),
                    id,
                    value,
                    data
                ) == IERC1155TokenReceiver.onERC1155Received.selector,
                "unsafe transfer"
            );
        }
    }
     function _batchMint(
        address to,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) internal {
        ERC1155DATA storage s = getERC1155Storage();
        require(to != address(0), "to = 0 address");
        require(ids.length == values.length, "ids length != values length");

        for (uint256 i = 0; i < ids.length; i++) {
           s.balanceOf[to][ids[i]] += values[i];
        }

        emit TransferBatch(msg.sender, address(0), to, ids, values);

        if (to.code.length > 0) {
            require(
                IERC1155TokenReceiver(to).onERC1155BatchReceived(
                    msg.sender,
                    address(0),
                    ids,
                    values,
                    data
                ) == IERC1155TokenReceiver.onERC1155BatchReceived.selector,
                "unsafe transfer"
            );
        }
    }
    function _burn(address from, uint256 id, uint256 value) internal {
        ERC1155DATA storage s = getERC1155Storage();
        require(from != address(0), "from = 0 address");
        s.balanceOf[from][id] -= value;
        emit TransferSingle(msg.sender, from, address(0), id, value);
    }

    function _batchBurn(
        address from,
        uint256[] calldata ids,
        uint256[] calldata values
    ) internal {
        ERC1155DATA storage s = getERC1155Storage();
        require(from != address(0), "from = 0 address");
        require(ids.length == values.length, "ids length != values length");

        for (uint256 i = 0; i < ids.length; i++) {
            s.balanceOf[from][ids[i]] -= values[i];
        }

        emit TransferBatch(msg.sender, from, address(0), ids, values);
    }
}

contract MyMultiToken is ERC1155 {
    function mint(uint256 id, uint256 value, bytes memory data) external {
        _mint(msg.sender, id, value, data);
    }
      function batchMint(
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external {
        _batchMint(msg.sender, ids, values, data);
    }

    function burn(uint256 id, uint256 value) external {
        _burn(msg.sender, id, value);
    }

    function batchBurn(uint256[] calldata ids, uint256[] calldata values) external {
        _batchBurn(msg.sender, ids, values);
    }
}
