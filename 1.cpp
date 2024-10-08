#include<bits/stdc++.h>
using namespace std;

void solve()
{
	int n,m,q;
    cin>>n>>m>>q;
    vector<int> a(n);
    vector<int> b(m);
    unordered_map<int,int> hash;
    for(int i=0;i<n;i++){
        cin>>a[i];
    }
    for(int i=0;i<m;i++){
        cin>>b[i];
    }

    int j=0;
    int flag=1;
    for(int i=0;i<n && j<m;i++){
        if(b[j]==a[i] || hash[b[j]]!=0){
            while(j<m&&(b[j]==a[i] || hash[b[j]]!=0)){
                j++;
                hash[a[i]]++;
            }
        }
        else{
            cout<<"TIDAK"<<endl;
            flag=0;
            break;
        }
    }

    if(flag==1){
        cout<<"YA"<<endl;
    }
        
}

int32_t main()
{
 
	auto begin = std::chrono::high_resolution_clock::now();
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
   	int testcases=1;
   	if(1)
   		cin>>testcases;
   	int gh=1;
   	while(testcases--)
   	{
   		solve();
    }
    auto end = std::chrono::high_resolution_clock::now();
    auto elapsed = std::chrono::duration_cast<std::chrono::nanoseconds>(end - begin);
    cerr << "Time measured: " << elapsed.count() * 1e-9 << " seconds.\n";
    return 0;
}