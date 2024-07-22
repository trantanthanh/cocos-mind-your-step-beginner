import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    cloudPrefab: Prefab = null;
    @property roadLength: number = 50;

    private _road = [];

    start() {
        this.generateRoad();
    }

    generateRoad() {
        this._road.push(BlockType.BT_STONE);
        for (let i = 0; i < this.roadLength; i++) {
            if (this._road[i] == BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE);
            }
            else {
                this._road.push(Math.floor(Math.random() * 2));
            }
        }

        for (let i = 0; i < this.roadLength; i++) {
            const child = this.spawnBlockByType(this._road[i]);

            if (child) {
                this.node.addChild(child);
                child.setPosition(i, 0, 0);
            }
        }
    }

    spawnBlockByType(type: BlockType) {
        if (!this.cloudPrefab) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                block = instantiate(this.cloudPrefab);
                break;
        }

        return block;
    }

    update(deltaTime: number) {

    }
}


