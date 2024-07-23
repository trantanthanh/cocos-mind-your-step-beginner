import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE
}

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    cloudPrefab: Prefab = null;
    @property roadLength: number = 50;
    @property roadWidth: number = 3;
    @property(PlayerController) playerControl: PlayerController = null;
    @property(Node) startMenu: Node;

    private _road = [];
    private _currentState: GameState = GameState.GS_INIT;

    set currentState(state: GameState) {
        switch (state) {
            case GameState.GS_INIT:
                this.generateRoad();
                this.playerControl.setInputActive(false);
                this.startMenu.active = true;
                this._currentState = GameState.GS_INIT;
                break;
            case GameState.GS_PLAYING:
                setTimeout(() => {
                    this.playerControl.setInputActive(true);
                }, 0.2);
                this.startMenu.active = false;
                this._currentState = GameState.GS_PLAYING;
                break;
            case GameState.GS_END:
                this.playerControl.setInputActive(false);
                this._currentState = GameState.GS_END;
                break;
            default:
                this.generateRoad();
                break;
        }
    }

    get currentState() {
        return this._currentState;
    }



    start() {
        this.currentState = GameState.GS_INIT;
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
                child.setPosition(i * this.roadWidth, 0, 0);
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

    onStartButtonClick() {
        this.currentState = GameState.GS_PLAYING;
    }
}


