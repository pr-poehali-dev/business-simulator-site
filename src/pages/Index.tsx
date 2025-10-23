import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface GameState {
  level: number;
  coins: number;
  assets: number;
  clickPower: number;
  autoIncome: number;
  experience: number;
  experienceToNextLevel: number;
}

interface Upgrade {
  id: string;
  name: string;
  cost: number;
  effect: string;
  type: 'click' | 'auto';
  multiplier: number;
}

const UPGRADES: Upgrade[] = [
  { id: 'click1', name: 'Деловая хватка', cost: 100, effect: '+1 к клику', type: 'click', multiplier: 1 },
  { id: 'click2', name: 'MBA диплом', cost: 500, effect: '+5 к клику', type: 'click', multiplier: 5 },
  { id: 'auto1', name: 'Киоск', cost: 300, effect: '+2/сек', type: 'auto', multiplier: 2 },
  { id: 'auto2', name: 'Магазин', cost: 1000, effect: '+10/сек', type: 'auto', multiplier: 10 },
  { id: 'auto3', name: 'Офис', cost: 5000, effect: '+50/сек', type: 'auto', multiplier: 50 },
];

const LEADERBOARD = [
  { rank: 1, name: 'Алексей К.', level: 15, assets: 250000 },
  { rank: 2, name: 'Мария С.', level: 12, assets: 180000 },
  { rank: 3, name: 'Игорь П.', level: 10, assets: 120000 },
  { rank: 4, name: 'Вы', level: 1, assets: 0 },
];

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    coins: 0,
    assets: 0,
    clickPower: 1,
    autoIncome: 0,
    experience: 0,
    experienceToNextLevel: 100,
  });

  const [currentTab, setCurrentTab] = useState('game');

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameState.autoIncome > 0) {
        setGameState(prev => ({
          ...prev,
          coins: prev.coins + prev.autoIncome,
          assets: prev.assets + prev.autoIncome,
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.autoIncome]);

  const handleClick = () => {
    setGameState(prev => {
      const newCoins = prev.coins + prev.clickPower;
      const newExp = prev.experience + prev.clickPower;
      
      if (newExp >= prev.experienceToNextLevel) {
        return {
          ...prev,
          coins: newCoins,
          assets: newCoins,
          experience: newExp - prev.experienceToNextLevel,
          level: prev.level + 1,
          experienceToNextLevel: Math.floor(prev.experienceToNextLevel * 1.5),
        };
      }
      
      return {
        ...prev,
        coins: newCoins,
        assets: newCoins,
        experience: newExp,
      };
    });
  };

  const buyUpgrade = (upgrade: Upgrade) => {
    if (gameState.coins >= upgrade.cost) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - upgrade.cost,
        clickPower: upgrade.type === 'click' ? prev.clickPower + upgrade.multiplier : prev.clickPower,
        autoIncome: upgrade.type === 'auto' ? prev.autoIncome + upgrade.multiplier : prev.autoIncome,
      }));
    }
  };

  const experiencePercent = (gameState.experience / gameState.experienceToNextLevel) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-2 tracking-tight">
            ** БИЗНЕС СИМПАНИ **
          </h1>
          <p className="text-muted-foreground text-lg">Построй империю с нуля</p>
        </header>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="home" className="flex gap-2">
              <Icon name="Home" size={18} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="flex gap-2">
              <Icon name="Briefcase" size={18} />
              <span className="hidden sm:inline">Игра</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex gap-2">
              <Icon name="User" size={18} />
              <span className="hidden sm:inline">Профиль</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex gap-2">
              <Icon name="Trophy" size={18} />
              <span className="hidden sm:inline">Рейтинг</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex gap-2">
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Правила</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <Card className="p-8 border-2 border-primary/20">
              <div className="text-center space-y-6">
                <Icon name="Building2" size={80} className="mx-auto text-primary" />
                <h2 className="text-3xl font-bold">Добро пожаловать в мир бизнеса!</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Начни свой путь от простого клерка до магната. Кликай, зарабатывай, 
                  прокачивайся и строй бизнес-империю!
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 animate-pulse-glow"
                  onClick={() => setCurrentTab('game')}
                >
                  Начать игру
                </Button>
                <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <Icon name="TrendingUp" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Прокачка</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <Icon name="Coins" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Заработок</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <Icon name="Award" size={32} className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Рейтинг</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="game" className="animate-fade-in space-y-6">
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <Icon name="User" size={32} className="text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-1">Уровень {gameState.level}</Badge>
                    <div className="w-48">
                      <Progress value={experiencePercent} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {gameState.experience} / {gameState.experienceToNextLevel} опыта
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Монеты</p>
                  <p className="text-3xl font-bold text-primary flex items-center gap-2 justify-end">
                    <Icon name="Coins" size={28} />
                    {gameState.coins.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-primary/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="MousePointerClick" size={24} />
                  Активный заработок
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleClick}
                    className="w-48 h-48 rounded-full text-2xl font-bold animate-pulse-glow hover:scale-105 transition-transform"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon name="Briefcase" size={48} />
                      <span>КЛИК</span>
                      <span className="text-sm">+{gameState.clickPower}</span>
                    </div>
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Сила клика</p>
                    <p className="text-2xl font-bold text-primary">{gameState.clickPower}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 border-primary/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={24} />
                  Улучшения
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {UPGRADES.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">{upgrade.name}</p>
                        <p className="text-sm text-muted-foreground">{upgrade.effect}</p>
                      </div>
                      <Button
                        onClick={() => buyUpgrade(upgrade)}
                        disabled={gameState.coins < upgrade.cost}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Icon name="Coins" size={16} />
                        {upgrade.cost}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm text-muted-foreground">Пассивный доход</p>
                  <p className="text-xl font-bold text-primary">+{gameState.autoIncome}/сек</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card className="p-8 border-2 border-primary/20">
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary">
                  <Icon name="User" size={64} className="text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Ваш профиль</h2>
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    Уровень {gameState.level}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                  <Card className="p-6 bg-secondary/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="Coins" size={32} className="text-primary" />
                      <p className="text-sm text-muted-foreground">Монеты</p>
                    </div>
                    <p className="text-3xl font-bold">{gameState.coins.toLocaleString()}</p>
                  </Card>
                  <Card className="p-6 bg-secondary/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="Wallet" size={32} className="text-primary" />
                      <p className="text-sm text-muted-foreground">Активы</p>
                    </div>
                    <p className="text-3xl font-bold">{gameState.assets.toLocaleString()}</p>
                  </Card>
                  <Card className="p-6 bg-secondary/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="MousePointerClick" size={32} className="text-primary" />
                      <p className="text-sm text-muted-foreground">Сила клика</p>
                    </div>
                    <p className="text-3xl font-bold">{gameState.clickPower}</p>
                  </Card>
                  <Card className="p-6 bg-secondary/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name="TrendingUp" size={32} className="text-primary" />
                      <p className="text-sm text-muted-foreground">Доход/сек</p>
                    </div>
                    <p className="text-3xl font-bold">{gameState.autoIncome}</p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="animate-fade-in">
            <Card className="p-6 border-2 border-primary/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Trophy" size={28} className="text-primary" />
                Таблица лидеров
              </h2>
              <div className="space-y-3">
                {LEADERBOARD.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      player.name === 'Вы'
                        ? 'bg-primary/10 border-primary animate-pulse-glow'
                        : 'bg-secondary/50 border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        player.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                        player.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                        player.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-bold text-lg">{player.name}</p>
                        <p className="text-sm text-muted-foreground">Уровень {player.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Активы</p>
                      <p className="font-bold text-lg text-primary flex items-center gap-1">
                        <Icon name="Wallet" size={20} />
                        {player.name === 'Вы' ? gameState.assets.toLocaleString() : player.assets.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="animate-fade-in">
            <Card className="p-8 border-2 border-primary/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="BookOpen" size={28} className="text-primary" />
                Правила игры
              </h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Target" size={24} className="text-primary" />
                    Цель игры
                  </h3>
                  <p className="text-muted-foreground">
                    Стань самым успешным бизнесменом! Развивай свой бизнес от небольшого киоска 
                    до огромной корпорации. Поднимайся в рейтинге и становись легендой!
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Coins" size={24} className="text-primary" />
                    Как зарабатывать
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Кликай на большую кнопку для активного заработка</li>
                    <li>• Покупай улучшения для увеличения дохода</li>
                    <li>• Пассивный доход начисляется автоматически каждую секунду</li>
                  </ul>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} className="text-primary" />
                    Система прокачки
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• За каждый заработанный клик получаешь опыт</li>
                    <li>• При заполнении шкалы опыта повышается уровень</li>
                    <li>• Чем выше уровень, тем больше опыта нужно для следующего</li>
                  </ul>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Award" size={24} className="text-primary" />
                    Улучшения
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Деловая хватка</strong> и <strong>MBA диплом</strong> - увеличивают силу клика</li>
                    <li>• <strong>Киоск, Магазин, Офис</strong> - дают пассивный доход</li>
                    <li>• Покупай улучшения стратегически для максимальной эффективности</li>
                  </ul>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-center font-semibold text-lg">
                    💡 Совет: Начни с покупки пассивного дохода, чтобы монеты зарабатывались автоматически!
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
