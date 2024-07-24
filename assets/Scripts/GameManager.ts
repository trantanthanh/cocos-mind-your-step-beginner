import { _decorator, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE
}

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END_REVIVE,
    GS_END
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    cloudPrefab: Prefab = null;
    @property roadLength: number = 50;
    @property(PlayerController) playerControl: PlayerController = null;
    @property(Node) startMenu: Node;
    @property(Node) resultMenu: Node;
    @property(Label) scoreLabel: Label;

    private _road = [];
    private _currentState: GameState = GameState.GS_INIT;

    set currentState(state: GameState) {
        switch (state) {
            case GameState.GS_INIT:
                this.Init();
                break;
            case GameState.GS_PLAYING:
                setTimeout(() => {
                    this.playerControl.setInputActive(true);
                }, 0.2);
                this.startMenu.active = false;
                this.resultMenu.active = false;
                this._currentState = GameState.GS_PLAYING;
                break;
            case GameState.GS_END_REVIVE:
                this.playerControl.setInputActive(false);
                this.startMenu.active = false;
                this.resultMenu.active = true;
                this._currentState = GameState.GS_END_REVIVE;
                break;
            case GameState.GS_END:
                this.playerControl.setInputActive(false);
                this._currentState = GameState.GS_END;
                break;
        }
    }

    private Init() {
        this.scoreLabel.string = "0";
        if (this.startMenu) {
            this.startMenu.active = true;
        }
        if (this.resultMenu){
            this.resultMenu.active = false;
        }
        this._currentState = GameState.GS_INIT;


        this.generateRoad();

        if (this.playerControl) {
            this.playerControl.setInputActive(false);
            this.playerControl.node.setPosition(Vec3.ZERO);
            this.playerControl.Reset();
        }
    }

    private NextLevel()
    {
        if (this.startMenu) {
            this.startMenu.active = false;
        }
        if (this.resultMenu){
            this.resultMenu.active = false;
        }
        this._currentState = GameState.GS_PLAYING;


        this.generateRoad();

        if (this.playerControl) {
            this.playerControl.setInputActive(true);
            this.playerControl.node.setPosition(Vec3.ZERO);
            this.playerControl.Reset();
        }
    }

    revive() {
        
    }

    get currentState() {
        return this._currentState;
    }



    start() {
        this.currentState = GameState.GS_INIT;
        this.playerControl.node.on("JumpEnd", this.onPlayerJumpEnd, this);
    }

    checkResult(moveIndex: number) {
        if (moveIndex < this.roadLength - 1) {
            if (this._road[moveIndex] == BlockType.BT_NONE) {
                this.scoreLabel.string = moveIndex.toString();
                this.currentState = GameState.GS_END_REVIVE;
            }
        }
        else {
            this.currentState = GameState.GS_END;
        }
    }

    onPlayerJumpEnd(moveIndex: number) {
        this.checkResult(moveIndex);
    }

    generateRoad() {
        this.node.removeAllChildren();

        this._road = [];
        // startPos
        this._road.push(BlockType.BT_STONE);

        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
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

    onStartButtonClick() {
        this.currentState = GameState.GS_PLAYING;
    }
}


